import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: [true, 'El tipo (ingreso/gasto) es obligatorio']
  }
}, {
  timestamps: true
});

// Índice único compuesto: No puedes tener la misma categoría "Ocio"
// para "expense" y "expense" dos veces, pero sí "Ocio" (expense) y "Ocio" (income).
categorySchema.index({ name: 1, type: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;