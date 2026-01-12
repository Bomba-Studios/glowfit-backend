import express from "express";
import {
  register,
  login,
  logout,
  getUsers,
  getProfile,
  updateUser,
  getUserById,
  getUserActivity,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// rutas publicas
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);

// rutas privadas
router.get("/all-users", authenticateToken, getUsers);
router.get("/profile", authenticateToken, getProfile);
router.get("/:id/activity", authenticateToken, getUserActivity);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);

export default router;
