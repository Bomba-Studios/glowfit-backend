import prisma from "../config/prismaClient.js";

export const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const create = async (data) => {
  return await prisma.user.create({
    data,
  });
};

export const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      last_name: true,
      date_of_birth: true,
      weight: true,
      height: true,
      gender: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const findAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      last_name: true,
      date_of_birth: true,
      weight: true,
      height: true,
      gender: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const update = async (id, data) => {
  const { user_training_days, ...userData } = data;

  const updateData = { ...userData };

  if (user_training_days) {
    updateData.user_training_days = {
      deleteMany: {},
      create: user_training_days.create || [],
    };
  }
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      last_name: true,
      date_of_birth: true,
      weight: true,
      height: true,
      bmi: true,
      gender: true,
      created_at: true,
      updated_at: true,
      role: true,
      goal_id: true,
      user_training_days: {
        select: {
          day_id: true,
          day: true,
        },
      },
      has_disability: true,
      disability_description: true,
    },
  });
};
