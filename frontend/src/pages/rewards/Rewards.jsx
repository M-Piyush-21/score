import React, { useEffect, useState } from 'react';
import './rewards.css';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaGift, FaStar, FaMedal, FaCrown } from 'react-icons/fa';
import { CourseData } from '../../context/CourseContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';

const MEDALS = [
  {
    name: 'Bronze Medal',
    lectures: 10,
    icon: FaMedal,
    description: 'Complete 10 lectures to earn the Bronze Medal',
    rewards: [
      'Exclusive Vedantu Learning Bag',
      'Special Student Badge',
      'Digital Certificate of Achievement'
    ],
    color: '#CD7F32'
  },
  {
    name: 'Silver Medal',
    lectures: 25,
    icon: FaMedal,
    description: 'Complete 25 lectures to earn the Silver Medal',
    rewards: [
      'Premium Study Material Kit',
      '1-Month Free Subscription',
      'Access to Exclusive Doubt Sessions',
      'Silver Badge on Profile'
    ],
    color: '#C0C0C0'
  },
  {
    name: 'Gold Medal',
    lectures: 50,
    icon: FaMedal,
    description: 'Complete 50 lectures to earn the Gold Medal',
    rewards: [
      'High-Quality Tablet for Learning',
      '3-Months Free Subscription',
      'One-on-One Mentorship Session',
      'Gold Badge on Profile',
      'Access to Premium Study Resources'
    ],
    color: '#FFD700'
  },
  {
    name: 'Platinum Medal',
    lectures: 100,
    icon: FaCrown,
    description: 'Complete 100 lectures to earn the Platinum Medal',
    rewards: [
      'Latest iPad for Enhanced Learning',
      '1-Year Free Subscription',
      'Personal Academic Counseling',
      'Platinum Badge on Profile',
      'Exclusive Access to Master Classes',
      'Featured Student on Platform'
    ],
    color: '#E5E4E2'
  }
];

const Rewards = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view rewards');
      navigate('/login');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/student/stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="rewards-container">
        <div className="rewards-loading">
          <div className="loading-spinner"></div>
          <p>Loading your rewards...</p>
        </div>
      </div>
    );
  }

  const completedLectures = stats.completedLectures || 0;

  const calculateProgress = (target) => {
    const progress = (completedLectures / target) * 100;
    return Math.min(progress, 100);
  };

  const getNextMedal = () => {
    const nextMedal = MEDALS.find(medal => completedLectures < medal.lectures);
    if (!nextMedal) return null;
    return {
      ...nextMedal,
      progress: calculateProgress(nextMedal.lectures),
      lecturesNeeded: nextMedal.lectures - completedLectures
    };
  };

  const nextMedal = getNextMedal();

  return (
    <div className="rewards-container">
      <div className="rewards-header">
        <h1>Learning Rewards</h1>
        <div className="stats-summary">
          <div className="stat-item">
            <h3>Lectures Completed</h3>
            <p>{completedLectures}</p>
          </div>
          <div className="stat-item">
            <h3>Courses Enrolled</h3>
            <p>{stats.enrolledCourses}</p>
          </div>
          <div className="stat-item">
            <h3>Overall Progress</h3>
            <p>{Math.round(stats.overallProgress)}%</p>
          </div>
        </div>
      </div>

      {nextMedal && (
        <div className="next-medal-section">
          <h2>Next Achievement</h2>
          <div className="next-medal-card">
            <div className="medal-icon" style={{ backgroundColor: nextMedal.color }}>
              <nextMedal.icon size={32} />
            </div>
            <div className="medal-info">
              <h3>{nextMedal.name}</h3>
              <p>{nextMedal.description}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${nextMedal.progress}%`, backgroundColor: nextMedal.color }}
                ></div>
              </div>
              <p className="progress-text">
                {nextMedal.lecturesNeeded} lectures needed
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="medals-grid">
        {MEDALS.map((medal) => {
          const isEarned = completedLectures >= medal.lectures;
          const progress = calculateProgress(medal.lectures);
          
          return (
            <div key={medal.name} className={`medal-card ${isEarned ? 'earned' : ''}`}>
              <div className="medal-icon" style={{ backgroundColor: medal.color }}>
                <medal.icon size={24} />
              </div>
              <div className="medal-content">
                <h3>{medal.name}</h3>
                <p>{medal.description}</p>
                <div className="rewards-list">
                  <h4>Rewards You'll Get:</h4>
                  <ul>
                    {medal.rewards.map((reward, index) => (
                      <li key={index} className={isEarned ? 'earned' : ''}>
                        {isEarned ? '✓' : '•'} {reward}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%`, backgroundColor: medal.color }}
                  ></div>
                </div>
                <p className="progress-text">
                  {isEarned ? (
                    <span className="earned-text">Congratulations! Rewards Unlocked!</span>
                  ) : (
                    `${Math.round(progress)}% Complete - ${medal.lectures - completedLectures} lectures to go!`
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {stats.courses && stats.courses.length > 0 && (
        <div className="course-progress-section">
          <h2>Course Progress</h2>
          <div className="course-progress-list">
            {stats.courses.map((course) => (
              <div key={course.course._id} className="course-progress-item">
                <h3>{course.course.title}</h3>
                <div className="progress-details">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span>{course.completedLectures}/{course.totalLectures} lectures</span>
                    <span>{Math.round(course.progress)}% Complete</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
