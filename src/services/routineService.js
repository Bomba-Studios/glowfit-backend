import * as routineRepository from "../repositories/routineRepository.js";

export const createRoutine = async (data) => {
  // Aquí se pueden agregar validaciones adicionales si es necesario
  if (!data.name || !data.user_id) {
    throw new Error("El nombre y el ID de usuario son obligatorios");
  }

  return await routineRepository.createRoutine(data);
};

export const getRoutinesByUserId = async (userId) => {
  if (!userId) {
    throw new Error("El ID de usuario es obligatorio");
  }
  return await routineRepository.getRoutinesByUserId(userId);
};

export const markRoutineAsCompleted = async (routineId) => {
  if (!routineId) {
    throw new Error("El ID de la rutina es obligatorio");
  }
  return await routineRepository.markRoutineAsCompleted(routineId);
};
