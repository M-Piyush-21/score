import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";

export const getAllCourses = TryCatch(async (req, res) => {
  try {
    const courses = await Courses.find()
      .select('title description image duration createdBy price')
      .lean()
      .sort({ createdAt: -1 });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found"
      });
    }

    // Add lecture count for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const lectureCount = await Lecture.countDocuments({ course: course._id });
        return {
          ...course,
          lectureCount
        };
      })
    );

    res.status(200).json({
      success: true,
      courses: coursesWithStats,
    });
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message
    });
  }
});

export const getSingleCourse = TryCatch(async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Get lecture count and progress if user is authenticated
    let lectureCount = 0;
    let progress = null;

    if (req.user) {
      lectureCount = await Lecture.countDocuments({ course: req.params.id });
      
      if (req.user.subscription.includes(req.params.id)) {
        progress = await Progress.findOne({
          user: req.user._id,
          course: req.params.id
        });

        if (!progress) {
          progress = await Progress.create({
            user: req.user._id,
            course: req.params.id,
            completedLectures: []
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      course: {
        ...course.toObject(),
        lectureCount,
        progress: progress ? {
          completedLectures: progress.completedLectures.length,
          totalLectures: lectureCount,
          percentage: lectureCount ? Math.round((progress.completedLectures.length * 100) / lectureCount) : 0
        } : null
      }
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course details"
    });
  }
});

export const fetchLectures = TryCatch(async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Allow admin to view lectures
    if (user.role !== "admin" && !user.subscription.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "You have not subscribed to this course"
      });
    }

    const lectures = await Lecture.find({ course: courseId })
      .select('title description video duration')
      .sort({ createdAt: 1 });

    if (!lectures || lectures.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No lectures found for this course"
      });
    }

    res.status(200).json({
      success: true,
      lectures
    });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lectures"
    });
  }
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const courses = await Courses.find({
      _id: { $in: user.subscription }
    });

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your courses"
    });
  }
});

export const checkout = TryCatch(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (user.subscription && user.subscription.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: "You already have this course"
      });
    }

    const options = {
      amount: Number(course.price * 100),
      currency: "INR",
    };

    console.log("Creating order with options:", options);
    const order = await instance.orders.create(options);
    console.log("Order created:", order);

    res.status(201).json({
      success: true,
      order,
      course
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not create order",
      error: error.message
    });
  }
});

export const paymentVerification = TryCatch(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const courseId = req.params.id;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_Secret)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);
    user.subscription.push(courseId);
    await user.save();
    
    // Create initial progress record
    await Progress.create({
      user: req.user._id,
      course: courseId,
      completedLectures: []
    });

    res.status(200).json({
      success: true,
      message: "Course Purchased Successfully"
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
});

export const addProgress = TryCatch(async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: req.query.course,
        completedLectures: [],
      });
    }

    const { lectureId } = req.query;

    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
      await progress.save();
    }

    // Calculate updated progress percentage
    const allLectures = await Lecture.countDocuments({ course: req.query.course });
    const completedLectures = progress.completedLectures.length;
    const courseProgressPercentage = Math.round((completedLectures * 100) / allLectures);

    res.status(201).json({
      success: true,
      message: "Progress updated",
      progress: {
        completedLectures: progress.completedLectures,
        percentage: courseProgressPercentage
      }
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress"
    });
  }
});

export const getYourProgress = TryCatch(async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: req.query.course,
        completedLectures: [],
      });
    }

    const allLectures = await Lecture.countDocuments({ course: req.query.course });
    const completedLectures = progress.completedLectures.length;
    const courseProgressPercentage = Math.round((completedLectures * 100) / allLectures);

    res.json({
      success: true,
      progress: [progress],
      courseProgressPercentage,
      completedLectures,
      allLectures,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress"
    });
  }
});

export const getStudentStats = TryCatch(async (req, res) => {
  try {
    // Get user's enrolled courses
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get all courses enrolled by the user
    const enrolledCourses = await Payment.find({ user: user._id })
      .populate({
        path: 'course',
        select: 'title description lectures'
      });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      enrolledCourses.map(async (enrollment) => {
        const progress = await Progress.find({
          user: user._id,
          course: enrollment.course._id
        });

        const totalLectures = await Lecture.countDocuments({
          course: enrollment.course._id
        });

        return {
          course: enrollment.course,
          completedLectures: progress.length,
          totalLectures,
          progress: totalLectures > 0 ? (progress.length / totalLectures) * 100 : 0
        };
      })
    );

    // Calculate total stats
    const totalCourses = coursesWithProgress.length;
    const totalLectures = coursesWithProgress.reduce((acc, curr) => acc + curr.totalLectures, 0);
    const completedLectures = coursesWithProgress.reduce((acc, curr) => acc + curr.completedLectures, 0);
    const overallProgress = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

    res.status(200).json({
      success: true,
      stats: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        enrolledCourses: totalCourses,
        totalLectures,
        completedLectures,
        overallProgress,
        courses: coursesWithProgress
      }
    });
  } catch (error) {
    console.error("Error in getStudentStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student statistics",
      error: error.message
    });
  }
});
