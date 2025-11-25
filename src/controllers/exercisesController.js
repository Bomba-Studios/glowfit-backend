import prisma from "../prismaClient.js";

export const getExercises = async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ejercicios" });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: req.params.id },
    });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ejercicio" });
  }
};

export const createExercise = async (req, res) => {
  try {
    const exercise = await prisma.exercise.create({
      data: req.body,
    });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al crear ejercicio" });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const exercise = await prisma.exercise.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar ejercicio" });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const exercise = await prisma.exercise.delete({
      where: { id: req.params.id },
    });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar ejercicio" });
  }
};
