import * as muscleGroupRepository from "../repositories/muscleGroupRepository.js";

export const getMuscleGroups = async () => {
    return await muscleGroupRepository.findAll();
};

export const createMuscleGroup = async (data) => {
    return await muscleGroupRepository.create(data);
};
