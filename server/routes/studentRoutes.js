import express from "express";
import { getStudentStats } from "../controllers/student.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Student routes
router.get("/stats", isAuth, getStudentStats);

export default router;
