import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  paymentVerification,
  addProgress,
  getYourProgress,
  getStudentStats,
} from "../controllers/course.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Public routes
router.get("/course/all", getAllCourses);

// Protected routes
router.get("/course/:id", isAuth, getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.get("/course/student/stats", isAuth, getStudentStats);

// Payment routes
router.post("/course/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);

// Progress routes
router.post("/progress", isAuth, addProgress);
router.get("/progress", isAuth, getYourProgress);

export default router;
