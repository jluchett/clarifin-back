import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas (¡Aún por crear!)
// import transactionRoutes from './routes/transactions.js';
// import categoryRoutes from './routes/categories.js';
// import budgetRoutes from './routes/budgets.js';
// import reportRoutes from './routes/reports.js';
// import syncRoutes from './routes/sync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
// Habilitar CORS para que tu frontend (corriendo en otro puerto) pueda hablar con este backend
app.use(cors()); 
// Permitir que Express entienda JSON
app.use(express.json()); 

// --- Conexión a MongoDB Atlas ---
// Asegúrate de tener MONGO_URI en tu archivo .env
const MONGO_URI = process.env.MONGO_URI || "tu_string_de_conexion_de_mongodb_atlas_aqui";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas exitosamente"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// --- Rutas de la API ---
// Aquí es donde "enchufarás" tus rutas
app.get("/", (req, res) => {
  res.send("API de Finanzas Personales funcionando!");
});

// Rutas de ejemplo (descomentar cuando las crees)
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/budgets', budgetRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/sync', syncRoutes); // Ruta para tu API de OCR

// --- Iniciar Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});