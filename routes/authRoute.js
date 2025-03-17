import express from "express";
import { register, verifyEmail, login } from "../controller/authController.js"; 

import { authenticate, authorizeRole } from "../middleware/authMiddleware.js"; 

const authRoutes = express.Router();

// Authentication routes
authRoutes.post('/register', register);
authRoutes.get('/verify-email', verifyEmail);
authRoutes.post('/login', login);

// Example of a protected route
authRoutes.get('/admin', authenticate, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default authRoutes;