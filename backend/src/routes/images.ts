import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all categories with their images
router.get('/categories', async (req, res) => {
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
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
