import React, { useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import { toast } from "react-hot-toast";
import { User, Clock, Video, Book, CheckCircle, Play } from "lucide-react";
import "./coursestudy.css";

const CourseStudy = () => {
  const params = useParams();
  const { fetchCourse, course, loading } = CourseData();
  const navigate = useNavigate();

  const loadCourse = useCallback(async () => {
    if (!params.id) {
      navigate('/dashboard');
      return;
    }

    try {
      await fetchCourse(params.id);
    } catch (error) {
      console.error("Error loading course:", error);
      toast.error("Failed to load course details");
      navigate('/dashboard');
    }
  }, [params.id, navigate, fetchCourse]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return null;
  }

  return (
    <div className="course-study-container">
      <div className="course-study-page">
        <div className="course-header">
          <div className="header-bg">
            <img src={`${server}/${course.image}`} alt={course.title} />
          </div>
          <div className="header-content">
            <h1>{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>
          </div>
        </div>

        <div className="course-details">
          <div className="course-main">
            <div className="instructor-card">
              <div className="instructor-icon">
                <User size={24} />
              </div>
              <div className="instructor-info">
                <span>Instructor</span>
                <h3>{course.createdBy}</h3>
              </div>
            </div>

            <div className="course-stats">
              <div className="stat-card">
                <Clock className="stat-icon" />
                <div className="stat-info">
                  <span>Duration</span>
                  <h4>{course.duration} weeks</h4>
                </div>
              </div>
              <div className="stat-card">
                <Video className="stat-icon" />
                <div className="stat-info">
                  <span>Total Lectures</span>
                  <h4>{course.lectureCount || 0} lectures</h4>
                </div>
              </div>
              <div className="stat-card">
                <Book className="stat-icon" />
                <div className="stat-info">
                  <span>Access</span>
                  <h4>Lifetime</h4>
                </div>
              </div>
            </div>

            {course.progress && (
              <div className="course-progress">
                <div className="progress-header">
                  <CheckCircle className="progress-icon" />
                  <h3>Your Progress</h3>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.progress.percentage}%` }}
                  />
                </div>
                <p className="progress-text">
                  {course.progress.completedLectures} of {course.progress.totalLectures} lectures completed ({course.progress.percentage}%)
                </p>
              </div>
            )}
          </div>

          <div className="course-preview">
            <div className="preview-card">
              <div className="preview-image">
                <img src={`${server}/${course.image}`} alt={course.title} />
                <div className="play-overlay">
                  <Play size={40} />
                </div>
              </div>
              <Link to={`/lecture/${params.id}`} className="start-learning-btn">
                {course.progress ? 'Continue Learning' : 'Start Learning Now'}
                <Play className="btn-icon" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStudy;
