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
    console.log('Found', categories.length, 'categories');
    res.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new category
router.post('/categories', authenticateAdmin, async (req, res) => {
  const { name, description } = req.body;
  try {
    console.log('Creating new category:', { name, description });
    const category = await prisma.imageCategory.create({
      data: { name, description }
    });
    console.log('Created category:', category);
    res.json(category);
  } catch (error) {
    console.error('Failed to create category:', error);
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
    console.log('Uploading image:', {
      title,
      description,
      categoryId,
      url,
      file: req.file.filename
    });

    const image = await prisma.image.create({
      data: {
        title,
        description,
        url,
        categoryId: parseInt(categoryId),
        displayOrder: 0 // Default to start of list
      }
    });

    console.log('Created image:', image);
    res.json(image);
  } catch (error) {
    console.error('Failed to save image:', error);
    // Clean up uploaded file if database operation fails
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to save image information' });
  }
});

// Update image order
router.put('/reorder', authenticateAdmin, async (req, res) => {
  const { images } = req.body; // Array of { id, displayOrder }
  try {
    console.log('Reordering images:', images);
    const updates = images.map(({ id, displayOrder }) =>
      prisma.image.update({
        where: { id },
        data: { displayOrder }
      })
    );
    await prisma.$transaction(updates);
    console.log('Successfully reordered images');
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update image order:', error);
    res.status(500).json({ error: 'Failed to update image order' });
  }
});

// Delete image
router.delete('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    console.log('Deleting image:', id);
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
    console.log('Successfully deleted image');
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Delete category and all its images
router.delete('/categories/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    console.log('Deleting category:', id);
    
    // Get all images in the category
    const category = await prisma.imageCategory.findUnique({
      where: { id: parseInt(id) },
      include: { images: true }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete all image files
    for (const image of category.images) {
      const filePath = path.join(__dirname, '../../../../frontend/public', image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // First delete all images in the category
    await prisma.image.deleteMany({
      where: { categoryId: parseInt(id) }
    });

    // Then delete the category
    await prisma.imageCategory.delete({
      where: { id: parseInt(id) }
    });

    console.log('Successfully deleted category and its images');
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
