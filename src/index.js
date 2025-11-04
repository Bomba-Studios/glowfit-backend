import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log('Servidor corriendo en el puerto', process.env.PORT);
});
