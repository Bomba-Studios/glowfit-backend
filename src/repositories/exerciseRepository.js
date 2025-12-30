import prisma from "../config/prismaClient.js";

export const findAll = async () => {
  return await prisma.exercise.findMany();
};

export const findByName = async (name) => {
  return await prisma.exercise.findFirst({
    where: { name },
  });
};

export const findById = async (id) => {
  return await prisma.exercise.findUnique({
    where: { id },
  });
};

export const create = async (data) => {
  return await prisma.exercise.create({
    data,
  });
};

export const update = async (id, data) => {
  return await prisma.exercise.update({
    where: { id },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.exercise.delete({
    where: { id },
  });
};
