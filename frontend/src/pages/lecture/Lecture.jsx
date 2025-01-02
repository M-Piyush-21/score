import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import "./lecture.css";
import { FaPlay, FaLock, FaClock, FaCheckCircle, FaList, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const Lecture = ({ user }) => {
  const [lectureNumber, setLectureNumber] = useState(0);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    completedLectures: [],
    percentage: 0
  });
  const { course } = CourseData();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
      return navigate("/");
    }
  }, [user, navigate, params.id]);

  async function fetchLectures() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      });
      
      if (data.success && data.lectures) {
        setLectures(data.lectures);
        if (data.lectures.length > 0) {
          setLectureNumber(0);
        }
        await fetchProgress();
      } else {
        toast.error(data.message || "Failed to fetch lectures");
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      toast.error(error.response?.data?.message || "Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCourse() {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await axios.delete(`${server}/api/course/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Course deleted successfully");
        // Clear course from context if needed
        navigate("/courses");
      } else {
        toast.error(response.data.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this course");
      } else if (error.response?.status === 404) {
        toast.error("Course not found");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete course");
      }
    }
  }

  async function deleteLecture(lectureId) {
    if (!window.confirm("Are you sure you want to delete this lecture? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await axios.delete(`${server}/api/lecture/${lectureId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Lecture deleted successfully");
        // Refresh lectures list
        fetchLectures();
        // Reset lecture number if needed
        if (lectureNumber >= lectures.length - 1) {
          setLectureNumber(Math.max(0, lectures.length - 2));
        }
      } else {
        toast.error(response.data.message || "Failed to delete lecture");
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this lecture");
      } else if (error.response?.status === 404) {
        toast.error("Lecture not found");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete lecture");
      }
    }
  }

  async function fetchProgress() {
    try {
      const { data } = await axios.get(`${server}/api/progress`, {
        params: { course: params.id },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      });

      if (data.success) {
        setProgress({
          completedLectures: data.progress[0]?.completedLectures || [],
          percentage: data.courseProgressPercentage || 0
        });
      } else {
        console.error("Failed to fetch progress:", data.message);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to fetch progress");
    }
  }

  async function markLectureComplete(lectureId) {
    try {
      const { data } = await axios.post(
        `${server}/api/progress`,
        {},
        {
          params: {
            course: params.id,
            lectureId: lectureId
          },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true
        }
      );

      if (data.success) {
        setProgress(prev => ({
          ...prev,
          completedLectures: [...prev.completedLectures, lectureId],
          percentage: data.progress.percentage
        }));
        toast.success("Progress updated");
      } else {
        toast.error(data.message || "Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error(error.response?.data?.message || "Failed to update progress");
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchLectures();
    }
  }, [params.id]);

  const handleLectureClick = async (index, lectureId) => {
    setLectureNumber(index);
    if (!progress.completedLectures.includes(lectureId)) {
      await markLectureComplete(lectureId);
    }
  };

  return (
    <div className="lecture-container">
      <div className="lecture-layout">
        {/* Sidebar */}
        <div className="lecture-sidebar">
          <div className="course-info">
            <h2>{course?.title}</h2>
          </div>

          <div className="lecture-list">
            <div className="list-header">
              <FaList className="list-icon" />
              <h3>Course Content</h3>
            </div>
            {lectures?.map((lecture, index) => (
              <button
                key={lecture._id}
                className={`lecture-item ${index === lectureNumber ? "active" : ""} ${
                  progress.completedLectures.includes(lecture._id) ? "completed" : ""
                }`}
                onClick={() => handleLectureClick(index, lecture._id)}
              >
                <div className="lecture-item-content">
                  <div className="lecture-icon">
                    {progress.completedLectures.includes(lecture._id) ? (
                      <FaCheckCircle className="completed-icon" />
                    ) : index <= lectureNumber ? (
                      <FaPlay />
                    ) : (
                      <FaLock />
                    )}
                  </div>
                  <div className="lecture-details">
                    <h4>{lecture.title}</h4>
                    <div className="lecture-meta">
                      <FaClock className="meta-icon" />
                      <span>{lecture.description}</span>
                    </div>
                  </div>
                </div>
                {index === lectureNumber && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: progress.completedLectures.includes(lecture._id) ? "100%" : "0%" 
                      }}
                    ></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lecture-main">
          {lectures && lectures[lectureNumber] && (
            <>
              <div className="video-container">
                <video
                  key={lectures[lectureNumber]._id}
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  onEnded={() => handleLectureClick(lectureNumber, lectures[lectureNumber]._id)}
                >
                  <source
                    src={`${server}/${lectures[lectureNumber].video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="lecture-info">
                <div className="lecture-header">
                  <h3>{lectures[lectureNumber].title}</h3>
                  {user?.role === "admin" && (
                    <button 
                      onClick={() => deleteLecture(lectures[lectureNumber]._id)}
                      className="delete-lecture-btn"
                      title="Delete Lecture"
                    >
                      <FaTrash className="delete-icon" />
                      <span>Delete Lecture</span>
                    </button>
                  )}
                </div>
                <p className="lecture-description">{lectures[lectureNumber].description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lecture;
