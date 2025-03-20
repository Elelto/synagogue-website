import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all categories with their images
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    console.log('Fetching categories');
    const categories = await prisma.imageCategory.findMany({
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    console.log(`Found ${categories.length} categories`);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'שגיאה בטעינת הקטגוריות' });
  }
});

// Create a new category
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'שם הקטגוריה הוא שדה חובה' });
    }

    console.log('Creating new category:', { name, description });
    const category = await prisma.imageCategory.create({
      data: {
        name,
        description: description || null
      }
    });
    
    console.log('Created category:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'שגיאה ביצירת הקטגוריה' });
  }
});

// Update a category
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'שם הקטגוריה הוא שדה חובה' });
    }

    console.log('Updating category:', { id, name, description });
    const category = await prisma.imageCategory.update({
      where: { id: Number(id) },
      data: {
        name,
        description: description || null
      }
    });
    
    console.log('Updated category:', category);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'שגיאה בעדכון הקטגוריה' });
  }
});

// Delete a category
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting category:', id);
    await prisma.imageCategory.delete({
      where: { id: Number(id) }
    });
    
    console.log('Deleted category:', id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'שגיאה במחיקת הקטגוריה' });
  }
});

export { router as categoriesRouter };
