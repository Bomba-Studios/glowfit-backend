import prisma from "../prismaClient.js";
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwtUtils.js';

// Registro de usuario
export const register = async (req, res) => {
  const { email, password, name, last_name } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "El email y la contraseña son obligatorios." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya existe." });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        last_name: last_name || null,
      },
    });

    // Generar token JWT
    const token = generateToken(newUser.id, newUser.email);

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error interno al crear usuario." });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = generateToken(user.id, user.email);

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener usuarios (protegido)
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        last_name: true,
        created_at: true,
        updated_at: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

export const createUser = register;
