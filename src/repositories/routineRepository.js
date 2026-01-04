import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRoutine = async (data) => {
  const {
    name,
    description,
    user_id,
    estimated_duration,
    level,
    goal,
    is_active,
    days,
    exercises,
  } = data;

  return await prisma.routines.create({
    data: {
      name,
      description,
      user_id,
      estimated_duration,
      level,
      goal,
      is_active,
      routine_days: {
        create: days.map((dayId) => ({
          day_id: dayId,
        })),
      },
      routine_exercises: {
        create: exercises.map((exercise) => ({
          exercise_id: exercise.exercise_id,
          order_position: exercise.order_position,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          rest_time: exercise.rest_time,
          notes: exercise.notes,
        })),
      },
    },
    include: {
      routine_days: true,
      routine_exercises: true,
    },
  });
};

export const getRoutinesByUserId = async (userId) => {
  return await prisma.routines.findMany({
    where: {
      user_id: userId,
    },
    include: {
      routine_days: true,
      routine_exercises: true,
    },
    include: {
      routine_days: true,
      routine_exercises: true,
    },
  });
};

export const markRoutineAsCompleted = async (routineId) => {
  return await prisma.routines.update({
    where: {
      id: routineId,
    },
    data: {
      is_completed: true,
      completed_at: new Date(),
    },
  });
};
