import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Descripción del gasto (ej: "Café en Starbucks", "Factura de luz")
  description: {
    type: String,
    trim: true,
    required: [true, "La descripción es obligatoria"]
  },
  
  // Monto del gasto. Usamos Number.
  // Guardaremos todo como números positivos y usaremos el 'type' para definir si es ingreso o gasto.
  amount: {
    type: Number,
    required: [true, "El monto es obligatorio"],
    min: [0, "El monto no puede ser negativo"]
  },

  // Tipo de transacción
  type: {
    type: String,
    enum: ['expense', 'income'], // Solo puede ser 'expense' o 'income'
    required: true
  },

  // Fecha en que ocurrió la transacción
  date: {
    type: Date,
    default: Date.now
  },

  // --- Relaciones ---

  // Categoría (ej: "Comida", "Transporte", "Sueldo")
  // Para la V1, guardaremos la categoría como un String simple.
  // Para la V2, podrías cambiar esto a: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  category: {
    type: String,
    default: 'Sin Categoría'
  },

  // Fuente de la transacción (para saber de dónde vino)
  origin: {
    type: String,
    enum: ['manual', 'ocr', 'banco'], // 'manual' (entrada manual), 'ocr' (tu app de recibos)
    default: 'manual'
  },

  // ID de la transacción en tu otra app de OCR (opcional pero MUY recomendado)
  // Esto evitará que importes duplicados.
  ocrTransactionId: {
    type: String,
    sparse: true, // Permite valores nulos, pero si existe, debe ser único
    unique: true,
    index: true,
    default: null
  }
  
}, {
  // Agrega timestamps (createdAt, updatedAt) automáticamente
  timestamps: true 
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;