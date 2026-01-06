import * as routineService from "../services/routineService.js";
import * as aiService from "../services/aiService.js";
import * as userService from "../services/userService.js";
import * as exerciseService from "../services/exerciseService.js";

export const createRoutine = async (req, res) => {
  try {
    const routine = await routineService.createRoutine(req.body);
    res.status(201).json(routine);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error al crear la rutina" });
  }
};

export const getRoutinesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const routines = await routineService.getRoutinesByUserId(userId);
    res.json(routines);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error al obtener las rutinas" });
  }
};

export const generateAIRoutine = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Obtener perfil del usuario
    const userProfile = await userService.getUserById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener ejercicios disponibles
    const exercises = await exerciseService.getExercises();
    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ error: "No hay ejercicios disponibles" });
    }

    // Generar rutina con IA
    const aiRoutineData = await aiService.generateRoutineWithAI(
      userProfile,
      exercises
    );

    // Guardar la rutina en la base de datos
    const routineData = {
      ...aiRoutineData,
      user_id: userId,
      is_active: true,
    };

    const savedRoutine = await routineService.createRoutine(routineData);

    res.status(201).json({
      message: "Rutina generada exitosamente con IA",
      routine: savedRoutine,
    });
  } catch (error) {
    console.error("Error al generar rutina con IA:", error);
    res
      .status(500)
      .json({ error: error.message || "Error al generar rutina con IA" });
  }
};

export const markRoutineAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const routine = await routineService.markRoutineAsCompleted(id);
    res.json(routine);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error al completar la rutina" });
  }
};

export const updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const routine = await routineService.updateRoutine(id, req.body);
    res.json(routine);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error al actualizar la rutina" });
  }
};
