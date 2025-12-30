import * as routineService from "../services/routineService.js";

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

export const generateRoutineAI = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from body (or use req.user.id if middleware integrated later)
    const routineContent = await routineService.generateRoutineAI(userId);
    res.json({ content: routineContent });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Error al generar la rutina con IA" });
  }
};
