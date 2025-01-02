import React, { useEffect, useState } from 'react';
import './profile.css';
import { UserData } from '../../context/UserContext';
import { server } from '../../main';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from '../../components/loading/Loading';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = UserData();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEnrolledCourses();
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      setEnrolledCourses(data.courses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast.error('Failed to fetch enrolled courses');
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <div className="user-info">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>

      <div className="enrolled-courses">
        <h3>Enrolled Courses</h3>
        {enrolledCourses.length === 0 ? (
          <p>No courses enrolled yet.</p>
        ) : (
          <div className="courses-grid">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="course-card">
                <img 
                  src={`${server}/${course.image}`} 
                  alt={course.title} 
                  className="course-thumbnail"
                />
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <p>{course.description}</p>
                  <button
                    onClick={() => navigate(`/course/study/${course._id}`)}
                    className="study-btn"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
