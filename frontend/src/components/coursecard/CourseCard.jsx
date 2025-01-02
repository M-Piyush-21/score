import React, { useState } from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";
import { Clock, PlayCircle, CheckCircle2 } from "lucide-react";

const CourseCard = ({ course, enrolled }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError || !course.image) {
      return "https://placehold.co/600x400?text=Course+Image";
    }
    return course.image.startsWith('http') 
      ? course.image 
      : `${server}/${course.image.replace(/^\/+/, '')}`;
  };

  const handleEnroll = async () => {
    if (user?.role === "admin") {
      navigate(`/course/study/${course._id}`);
      return;
    }
    if (enrolled) {
      navigate(`/course/study/${course._id}`);
    } else {
      if (!isAuth) {
        navigate("/login");
        return;
      }
      navigate(`/course/${course._id}`);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting course");
      }
    }
  };

  return (
    <div className="course-card">
      <div className="course-image-container">
        <img
          src={getImageUrl()}
          onError={handleImageError}
          alt={course.title}
          className="course-image"
        />
        <div className="play-overlay">
          <PlayCircle size={40} />
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => deleteHandler(course._id)}
            className="delete-button"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="course-content">
        <div className="course-title-wrapper">
          {course.title}
        </div>
        
        <div className="course-price">
          ₹{course.price}
        </div>

        {user?.role === "admin" ? (
          <button 
            onClick={handleEnroll} 
            className="buy-now-button admin"
          >
            View Course
          </button>
        ) : (
          <button 
            onClick={handleEnroll} 
            className={`buy-now-button ${enrolled ? 'enrolled' : ''}`}
          >
            {enrolled ? "Learn Now" : "Enroll Now"}
          </button>
        )}

        <div className="course-includes">
          <h4>INCLUDES</h4>
          <ul>
            <li>
              <Clock size={16} />
              <span>{course.duration} hours on-demand video</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Full lifetime access</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Exercise files</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Access from anywhere</span>
            </li>
            <li>
              <CheckCircle2 size={16} />
              <span>Certificate on completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
