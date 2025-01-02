import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { Plus, Upload, X, Book, Users, Clock, IndianRupee } from "lucide-react";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lecture Modal States
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureVideo, setLectureVideo] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
      return;
    }
    loadCourses();
  }, [user, navigate]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      await fetchCourses();
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    setLectureVideo(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true
      });

      toast.success(data.message);
      await loadCourses();
      resetForm();
      setShowCreateForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setBtnLoading(false);
    }
  };

  const resetForm = () => {
    setImage("");
    setTitle("");
    setDescription("");
    setDuration("");
    setImagePrev("");
    setCreatedBy("");
    setPrice("");
    setCategory("");
  };

  const openLectureModal = (course) => {
    setSelectedCourse(course);
    setShowLectureModal(true);
  };

  const closeLectureModal = () => {
    setShowLectureModal(false);
    setSelectedCourse(null);
    setLectureTitle("");
    setLectureDescription("");
    setLectureVideo("");
    setUploadProgress(0);
  };

  const addLecture = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const formData = new FormData();
    formData.append("title", lectureTitle);
    formData.append("description", lectureDescription);
    formData.append("file", lectureVideo);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${selectedCourse._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentage);
          },
        }
      );

      toast.success(data.message);
      closeLectureModal();
      await loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-courses">
        <div className="admin-header">
          <div className="header-content">
            <h1>Course Management</h1>
            <p>Manage your courses and lectures</p>
          </div>
          <button className="create-course-btn" onClick={toggleCreateForm}>
            <Plus size={20} />
            Create New Course
          </button>
        </div>

        <div className="course-stats">
          <div className="stat-card">
            <Book size={24} />
            <div className="stat-info">
              <h3>Total Courses</h3>
              <p>{courses.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <Users size={24} />
            <div className="stat-info">
              <h3>Total Students</h3>
              <p>0</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={24} />
            <div className="stat-info">
              <h3>Total Hours</h3>
              <p>{courses.reduce((acc, course) => acc + parseInt(course.duration || 0), 0)}</p>
            </div>
          </div>
          <div className="stat-card">
            <IndianRupee size={24} />
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p>₹{courses.reduce((acc, course) => acc + parseInt(course.price || 0), 0)}</p>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="create-course-section">
            <div className="section-header">
              <h2>Create New Course</h2>
              <button className="close-btn" onClick={toggleCreateForm}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitHandler} className="create-course-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (weeks)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Instructor Name"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />
              <textarea
                placeholder="Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="file-input">
                <input
                  type="file"
                  onChange={changeImageHandler}
                  accept="image/*"
                  required
                />
                <Upload size={24} />
                <span>Upload Course Thumbnail</span>
              </div>
              {imagePrev && (
                <div className="image-preview">
                  <img src={imagePrev} alt="Course Preview" />
                  <button type="button" onClick={() => setImagePrev("")}>
                    <X size={16} />
                  </button>
                </div>
              )}
              <button type="submit" disabled={btnLoading}>
                {btnLoading ? "Creating..." : "Create Course"}
              </button>
            </form>
          </div>
        )}

        <div className="courses-section">
          <div className="section-header">
            <h2>All Courses</h2>
            <div className="filters">
              {/* Add filters here if needed */}
            </div>
          </div>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card-wrapper">
                <CourseCard course={course} />
                <div className="card-actions">
                  <button
                    onClick={() => openLectureModal(course)}
                    className="add-lecture-btn"
                  >
                    <Plus size={16} />
                    Add Lecture
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showLectureModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">
                  <h3>Add Lecture</h3>
                  <p className="course-name">{selectedCourse?.title}</p>
                </div>
                <button className="close-btn" onClick={closeLectureModal}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={addLecture} className="lecture-form">
                <div className="form-group">
                  <label>
                    <span>Lecture Title</span>
                    <input
                      type="text"
                      placeholder="Enter lecture title"
                      value={lectureTitle}
                      onChange={(e) => setLectureTitle(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <span>Lecture Description</span>
                    <textarea
                      placeholder="Enter lecture description"
                      value={lectureDescription}
                      onChange={(e) => setLectureDescription(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label className="file-upload">
                    <span>Lecture Video</span>
                    <div className="file-input">
                      <input
                        type="file"
                        onChange={changeVideoHandler}
                        accept="video/*"
                        required
                      />
                      <div className="upload-content">
                        <Upload size={24} />
                        <span>Upload Video</span>
                        <p className="file-hint">MP4, WebM or Ogg file. Maximum 100MB</p>
                      </div>
                    </div>
                  </label>
                </div>
                {uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div className="progress-info">
                      <span>Uploading video...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeLectureModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Add Lecture
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCourses;
