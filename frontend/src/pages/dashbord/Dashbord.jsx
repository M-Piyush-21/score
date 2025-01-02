import React, { useEffect, useState } from "react";
import "./dashbord.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { getAuthHeaders } from "../../context/UserContext";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import {
  Book,
  Clock,
  BookOpen,
  Trophy,
  ChevronRight,
  PlayCircle,
  BarChart2,
  GraduationCap,
  Play,
  ChartBar
} from "lucide-react";
import axios from "axios";

const Dashbord = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const { mycourse, fetchMyCourses } = CourseData();
  const [loading, setLoading] = useState(true);
  const [studentStats, setStudentStats] = useState({
    totalLecturesAttended: 0,
    totalCourses: 0,
    courseProgress: []
  });

  const fetchData = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await fetchMyCourses();
      
      const { data } = await axios.get(
        `${server}/api/student/stats`,
        {
          headers: getAuthHeaders(),
          withCredentials: true
        }
      );

      if (data.success) {
        const stats = data.stats;
        setStudentStats({
          totalLecturesAttended: stats.completedLectures || 0,
          totalCourses: stats.enrolledCourses || 0,
          courseProgress: stats.coursesWithProgress?.map(course => ({
            courseName: course.course.title,
            courseId: course.course._id,
            completed: course.completedLectures,
            total: course.totalLectures,
            progress: course.progress
          })) || []
        });
      } else {
        toast.error(data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="avatar">
            {user?.name?.charAt(0) || "S"}
          </div>
          <div className="user-info">
            <h2>{user?.name || "Student"}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-icon">
              <GraduationCap size={24} />
            </div>
            <div className="stat-info">
              <h3>Enrolled</h3>
              <p>{studentStats.totalCourses} Courses</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <h3>Completed</h3>
              <p>{studentStats.totalLecturesAttended} Lectures</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">
              <BarChart2 size={24} />
            </div>
            <div className="stat-info">
              <h3>Average Progress</h3>
              <p>{Math.round(studentStats.courseProgress.reduce((acc, curr) => acc + curr.progress, 0) / Math.max(studentStats.courseProgress.length, 1))}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="welcome-banner">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name?.split(' ')[0] || "Student"}!</h1>
            <p>Continue your learning journey</p>
          </div>
          <button onClick={() => navigate('/courses')} className="browse-btn">
            Browse More Courses
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="courses-section">
          <h2>Your Learning Progress</h2>
          <div className="course-grid">
            {studentStats.courseProgress.length > 0 ? (
              studentStats.courseProgress.map((course) => (
                <div className="course-card" key={course.courseId}>
                  <div className="course-info">
                    <div>
                      <div className="course-header">
                        <BookOpen size={20} />
                        <h3>{course.courseName}</h3>
                      </div>
                      <div className="progress-stats">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="progress-text">{course.progress}% Complete</p>
                      </div>
                      <div className="course-meta">
                        <span className="meta-item">
                          <Clock size={14} />
                          {course.completed}/{course.total} Lectures
                        </span>
                        <span className="meta-item">
                          <ChartBar size={14} />
                          {course.progress}% Progress
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="study-btn" onClick={() => navigate(`/course/study/${course.courseId}`)}>
                        <GraduationCap size={14} />
                        Study Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <GraduationCap size={48} />
                <h3>No courses yet</h3>
                <p>Start your learning journey today!</p>
                <button onClick={() => navigate('/courses')} className="browse-btn">
                  Browse Courses
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
