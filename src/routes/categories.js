import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ type: 1, name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    // 11000 = Llave duplicada (por el índice único que creamos)
    if (error.code === 11000) {
      return res.status(409).json({ message: `La categoría '${req.body.name}' (${req.body.type}) ya existe.` });
    }
    res.status(400).json({ message: 'Error al crear categoría', error: error.message });
  }
});

// (Aquí irían PUT y DELETE para categorías si los necesitas)

export default router;