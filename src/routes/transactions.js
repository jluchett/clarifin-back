import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// GET /api/transactions
// (En V2, agregar filtros por fecha ?startDate=...&endDate=...)
router.get('/', async (req, res) => {
  try {
    // Ordenamos por fecha descendente (la más nueva primero)
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
  }
});

// POST /api/transactions (Crear una nueva)
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    // error.code 11000 es 'duplicate key' (por el ocrTransactionId)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Error: Transacción duplicada (ocrTransactionId ya existe)', error: error.message });
    }
    res.status(400).json({ message: 'Error al crear transacción', error: error.message });
  }
});

// PUT /api/transactions/:id (Actualizar una)
router.put('/:id', async (req, res) => {
  try {
    const updatedTx = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // {new: true} devuelve el doc actualizado
    );
    if (!updatedTx) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.status(200).json(updatedTx);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar transacción', error: error.message });
  }
});

// DELETE /api/transactions/:id (Eliminar una)
router.delete('/:id', async (req, res) => {
  try {
    const deletedTx = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTx) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.status(200).json({ message: 'Transacción eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar transacción', error: error.message });
  }
});

export default router;