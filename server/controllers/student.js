import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { Lecture } from "../models/Lecture.js";
import { Courses } from "../models/Courses.js";
import TryCatch from "../middlewares/TryCatch.js";

export const getStudentStats = TryCatch(async (req, res) => {
  try {
    // Get user with subscriptions
    const user = await User.findById(req.user._id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get enrolled courses from subscription
    const enrolledCourseIds = user.subscription || [];
    
    // Get course details with lectures
    const enrolledCourses = await Courses.find({
      _id: { $in: enrolledCourseIds }
    }).select('title description');

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      enrolledCourses.map(async (course) => {
        // Get progress record
        const progress = await Progress.findOne({
          user: user._id,
          course: course._id
        });

        // Get total lectures
        const totalLectures = await Lecture.countDocuments({
          course: course._id
        });

        const completedLectures = progress ? progress.completedLectures.length : 0;

        return {
          course: {
            _id: course._id,
            title: course.title,
            description: course.description
          },
          completedLectures,
          totalLectures,
          progress: totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0
        };
      })
    );

    // Calculate total stats
    const totalCourses = coursesWithProgress.length;
    const totalLectures = coursesWithProgress.reduce((acc, curr) => acc + curr.totalLectures, 0);
    const completedLectures = coursesWithProgress.reduce((acc, curr) => acc + curr.completedLectures, 0);
    const overallProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        enrolledCourses: totalCourses,
        totalLectures,
        completedLectures,
        overallProgress,
        coursesWithProgress
      }
    });
  } catch (error) {
    console.error("Error in getStudentStats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching student stats"
    });
  }
});
