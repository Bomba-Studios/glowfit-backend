import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from './jwtConfig.js';

export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.expiresIn }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    return null;
  }
};
