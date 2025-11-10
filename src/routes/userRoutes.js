import express from 'express';
import { register, login, getUsers, getProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// rutas publicas
router.post('/register', register);
router.post('/login', login);

// rutas privadas
router.get('/users', authenticateToken, getUsers);
router.get('/profile', authenticateToken, getProfile);

export default router;
