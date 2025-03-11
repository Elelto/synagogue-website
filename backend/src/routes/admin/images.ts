import { Router, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateAdmin } from '../../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../../frontend/public/uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all categories with their images
router.get('/categories', authenticateAdmin, async (req, res) => {
  try {
    const categories = await prisma.imageCategory.findMany({
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new category
router.post('/categories', authenticateAdmin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await prisma.imageCategory.create({
      data: { name, description }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Upload new image
router.post('/upload', authenticateAdmin, upload.single('image'), async (req: MulterRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { title, description, categoryId } = req.body;
  const url = `/uploads/images/${req.file.filename}`;

  try {
    const image = await prisma.image.create({
      data: {
        title,
        description,
        url,
        categoryId: parseInt(categoryId),
      }
    });
    res.json(image);
  } catch (error) {
    // Clean up uploaded file if database operation fails
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to save image information' });
  }
});

// Update image order
router.put('/reorder', authenticateAdmin, async (req, res) => {
  const { images } = req.body; // Array of { id, displayOrder }
  try {
    const updates = images.map(({ id, displayOrder }) =>
      prisma.image.update({
        where: { id },
        data: { displayOrder }
      })
    );
    await prisma.$transaction(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update image order' });
  }
});

// Delete image
router.delete('/images/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const image = await prisma.image.findUnique({ where: { id: parseInt(id) } });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the file
    const filePath = path.join(__dirname, '../../../../frontend/public', image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.image.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
