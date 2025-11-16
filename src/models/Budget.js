const budgetSchema = new mongoose.Schema({
  // Para la V1, nos vinculamos al nombre de la categoría (string)
  // Para la V2, esto sería: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  categoryName: {
    type: String,
    required: true,
    trim: true
  },

  amountLimit: {
    type: Number,
    required: true,
    min: [0, 'El límite del presupuesto debe ser positivo']
  },

  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },

  // Guardamos el primer día del período para saber a qué mes/año pertenece
  // Ej: Para "Noviembre 2025", guardaríamos "2025-11-01"
  periodStartDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Índice único: No puedes tener dos presupuestos para la misma
// categoría en el mismo período de inicio.
budgetSchema.index({ categoryName: 1, periodStartDate: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;