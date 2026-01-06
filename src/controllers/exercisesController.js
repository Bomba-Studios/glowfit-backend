import * as exerciseService from "../services/exerciseService.js";

export const getExercises = async (req, res) => {
  try {
    const { limit, offset, muscleGroupId, includeRelations, link } = req.query;

    const options = {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      muscleGroupId,
      includeRelations: includeRelations === "true",
      link,
    };

    const result = await exerciseService.getExercises(options);
    res.json({
      data: result.exercises,
      pagination: {
        total: result.total,
        limit: options.limit || null,
        offset: options.offset || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Error al obtener ejercicios" });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const exercise = await exerciseService.getExerciseById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ejercicio" });
  }
};

export const createExercise = async (req, res) => {
  try {
    const exercise = await exerciseService.createExercise(req.body);
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al crear ejercicio" });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const exercise = await exerciseService.updateExercise(
      req.params.id,
      req.body
    );
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar ejercicio" });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const exercise = await exerciseService.deleteExercise(req.params.id);
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar ejercicio" });
  }
};
