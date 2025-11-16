import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// --- ¡¡Mock de tu API de OCR!! ---
// Esto SIMULA la respuesta que tu otra app daría.
// Reemplaza esta función con una llamada `fetch` o `axios` real a tu API.
const fetchFromOcrApi = async () => {
  console.log("SIMULACIÓN: Llamando a la API de OCR externa...");
  
  // Simula una pequeña demora de red
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Esta es la data de ejemplo que tu API de OCR debería devolver
  // El `id` es crucial para evitar duplicados.
  return [
    { id: "ocr_id_901", description: "Supermercado El Grande", amount: 120.50, date: new Date("2025-11-15T10:30:00Z") },
    { id: "ocr_id_902", description: "Factura de Internet", amount: 55.00, date: new Date("2025-11-15T14:00:00Z") },
    { id: "ocr_id_903", description: "Cafetería La Esquina", amount: 8.75, date: new Date("2025-11-14T09:15:00Z") },
    // Este es un duplicado que ya simulamos haber guardado
    { id: "ocr_id_901", description: "Supermercado El Grande", amount: 120.50, date: new Date("2025-11-15T10:30:00Z") }, 
  ];
};
// --- Fin del Mock ---


// POST /api/sync/ocr
// Este endpoint llama a tu API de OCR, obtiene transacciones y las guarda
// en la base de datos de "Clarifin", evitando duplicados.
router.post('/ocr', async (req, res) => {
  let importedCount = 0;
  let duplicateCount = 0;
  
  try {
    // 1. Obtener transacciones de tu API de OCR
    const ocrTransactions = await fetchFromOcrApi();
    
    // 2. Procesar cada transacción
    for (const ocrTx of ocrTransactions) {
      if (!ocrTx.id || !ocrTx.amount || !ocrTx.description) {
        console.warn("Transacción OCR omitida (datos incompletos):", ocrTx);
        continue;
      }

      // 3. Verificar si ya existe por su ID de OCR
      // Usamos el campo `ocrTransactionId` que definimos en el modelo Transaction.js
      const existingTx = await Transaction.findOne({ ocrTransactionId: ocrTx.id });

      if (existingTx) {
        duplicateCount++;
        continue; // Ya existe, la saltamos.
      }

      // 4. Si no existe, la creamos
      const newTx = new Transaction({
        description: ocrTx.description,
        amount: ocrTx.amount,
        date: ocrTx.date,
        type: 'expense', // Asumimos 'expense' por defecto. Tu API podría proveer esto.
        category: 'Sincronizado OCR', // Categoría temporal hasta que el usuario la cambie
        origin: 'ocr',
        ocrTransactionId: ocrTx.id // ¡La clave para evitar duplicados!
      });
      
      await newTx.save();
      importedCount++;
    }
    
    console.log(`Sincronización OCR completada: ${importedCount} importadas, ${duplicateCount} duplicadas.`);
    
    // 5. Devolver un resumen al frontend
    res.status(200).json({ 
      success: true, 
      imported: importedCount, 
      duplicates: duplicateCount 
    });

  } catch (error) {
    console.error("Error grave en la sincronización OCR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error del servidor durante la sincronización", 
      error: error.message 
    });
  }
});

export default router;