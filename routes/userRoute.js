import express from "express";
import { fetch, create, update, deleteUser, getUserProfile } from "../controller/userController.js";
import { authenticate, authorizeRole } from '../middleware/authMiddleware.js';

const route = express.Router();

// Protect routes with authentication and admin authorization
route.post("/create", authenticate, authorizeRole(['admin']), create);
route.get("/getAllUsers", authenticate, authorizeRole(['admin']), fetch);
route.put("/update/:id", authenticate, authorizeRole(['admin']), update);
route.delete("/delete/:id", authenticate, authorizeRole(['admin']), deleteUser);
route.get('/profile', authenticate, getUserProfile);

export default route;
