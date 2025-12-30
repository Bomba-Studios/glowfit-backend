import prisma from "../config/prismaClient.js";

export const findAll = async () => {
  return await prisma.muscleGroup.findMany();
};

export const create = async (data) => {
  return await prisma.muscleGroup.create({
    data,
  });
};

export const findByName = async (name) => {
  return await prisma.muscleGroup.findUnique({
    where: { name },
  });
};
