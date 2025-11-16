import express from 'express';
import Budget from '../models/Budget.js';

const router = express.Router();

// GET /api/budgets
// Filtra por período. Ej: /api/budgets?period=2025-11
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.query.period) {
      // Asume que req.query.period es "YYYY-MM"
      const startDate = new Date(`${req.query.period}-01T00:00:00Z`);
      // periodStartDate debe ser exactamente el primer día de ese mes
      filter.periodStartDate = startDate;
    }
    
    const budgets = await Budget.find(filter);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener presupuestos', error: error.message });
  }
});

// POST /api/budgets (Para crear o actualizar un presupuesto)
// Usamos lógica "Upsert": si existe, lo actualiza; si no, lo crea.
router.post('/', async (req, res) => {
  const { categoryName, amountLimit, periodStartDate } = req.body;

  if (!categoryName || !amountLimit || !periodStartDate) {
    return res.status(400).json({ message: 'Faltan categoryName, amountLimit o periodStartDate' });
  }

  try {
    const budget = await Budget.findOneAndUpdate(
      // Filtro para encontrar (la llave única que definimos)
      { categoryName, periodStartDate: new Date(periodStartDate) },
      // Datos a actualizar (o crear)
      { amountLimit, period: 'monthly' }, // Asumimos 'monthly' por ahora
      // Opciones:
      {
        new: true, // Devuelve el documento nuevo/actualizado
        upsert: true, // Crea el documento si no existe
        runValidators: true,
      }
    );
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: 'Error al guardar el presupuesto', error: error.message });
  }
});

export default router;