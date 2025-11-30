import * as routineService from "../services/routineService.js";

export const createRoutine = async (req, res) => {
  try {
    const routine = await routineService.createRoutine(req.body);
    res.status(201).json(routine);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al crear la rutina" });
  }
};

export const getRoutinesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const routines = await routineService.getRoutinesByUserId(userId);
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al obtener las rutinas" });
  }
};
