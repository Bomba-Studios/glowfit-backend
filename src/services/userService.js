import * as userRepository from "../repositories/userRepository.js";
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtUtils.js';

export const register = async (userData) => {
    const { email, password, name, last_name } = userData;

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

export const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
};
