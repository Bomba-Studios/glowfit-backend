import prisma from "../prismaClient.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const createUser = async (req, res) => {
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

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name: name || null,
        last_name: last_name || null,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error interno al crear usuario." });
  }
};
