import prisma from "../prismaClient.js";

// Obtener grupos musculares
export const getMuscleGroups = async (req, res) => {
  try {
    const muscleGroups = await prisma.muscleGroup.findMany();
    res.json(muscleGroups);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener grupos musculares" });
  }
};

// Crear grupo muscular
export const createMuscleGroup = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El nombre es obligatorio." });
  }

  try {
    const newMuscleGroup = await prisma.muscleGroup.create({
      data: {
        name,
      },
    });

    res.status(201).json(newMuscleGroup);
  } catch (error) {
    console.error("Error al crear grupo muscular:", error);
    res.status(500).json({ error: "Error interno al crear grupo muscular." });
  }
};
