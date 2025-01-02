import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import { BookOpen, Users, VideoIcon } from 'lucide-react';
import "./dashboard.css";

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [stats, setStats] = useState([]);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const dashboardStats = [
    {
      title: "Total Courses",
      value: stats.totalCoures || 0,
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Total Lectures",
      value: stats.totalLectures || 0,
      icon: <VideoIcon className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <Users className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          
          <div className="stats-grid">
            {dashboardStats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-card"
              >
                <div className={`stat-icon-wrapper bg-gradient-to-br ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashbord;
