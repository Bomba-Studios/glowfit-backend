import * as userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtils.js";

const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }
  // Convertir altura de cm a metros
  const heightInMeters = height / 100;
  // IMC = peso (kg) / altura² (m²)
  const bmi = weight / (heightInMeters * heightInMeters);
  // Redondear a 2 decimales
  return Math.round(bmi * 100) / 100;
};

export const register = async (userData) => {
  const {
    email,
    password,
    name,
    last_name,
    date_of_birth,
    weight,
    height,
    gender,
  } = userData;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("El usuario ya existe.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.create({
    email,
    password: hashedPassword,
    name: name || null,
    last_name: last_name || null,
    date_of_birth: date_of_birth || null,
    weight: weight || null,
    height: height || null,
    gender: gender || null,
  });

  const token = generateToken(newUser.id, newUser.email);
  const { password: _, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Credenciales inválidas");
  }

  const token = generateToken(user.id, user.email);
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getUsers = async () => {
  return await userRepository.findAll();
};

export const getUserById = async (userId) => {
  return await userRepository.findById(userId);
};

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
};

export const updateUser = async (userId, data) => {
  // Si se actualizan weight o height, calcular el IMC automáticamente
  if (data.weight !== undefined || data.height !== undefined) {
    // Obtener los valores actuales del usuario si no están en data
    const currentUser = await userRepository.findById(userId);

    const weight = data.weight !== undefined ? data.weight : currentUser.weight;
    const height = data.height !== undefined ? data.height : currentUser.height;

    // Calcular el IMC
    const bmi = calculateBMI(weight, height);

    // Agregar el IMC a los datos a actualizar
    data.bmi = bmi;
  }

  return await userRepository.update(userId, data);
};
