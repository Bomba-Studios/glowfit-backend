import * as exerciseRepository from "../repositories/exerciseRepository.js";

export const getExercises = async () => {
    return await exerciseRepository.findAll();
};

export const getExerciseById = async (id) => {
    return await exerciseRepository.findById(id);
};

export const createExercise = async (data) => {
    return await exerciseRepository.create(data);
};

export const updateExercise = async (id, data) => {
    return await exerciseRepository.update(id, data);
};

export const deleteExercise = async (id) => {
    return await exerciseRepository.remove(id);
};
