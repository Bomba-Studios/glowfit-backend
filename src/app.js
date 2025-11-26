import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import exercisesRoutes from "./routes/exercisesRoutes.js";
import indexRoutes from "./routes/index.js";
import muscleGroupRoutes from "./routes/muscleGroupRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", indexRoutes);

// Rutas de usuarios
app.use("/users", userRoutes);

// Rutas de ejercicios
app.use("/exercises", exercisesRoutes);

// Rutas de grupos musculares
app.use("/muscle-groups", muscleGroupRoutes);

export default app;
