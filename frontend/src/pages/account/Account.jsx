import React from "react";
import { motion } from "framer-motion";
import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, Mail, BookOpen } from "lucide-react";

const Account = () => {
  const { user, logoutUser } = UserData();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Redirect if no user
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="account-container">
      <motion.div 
        className="profile"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="profile-header" variants={itemVariants}>
          <BookOpen className="profile-icon" />
          <h2>My Profile</h2>
        </motion.div>

        <div className="profile-info">
          <motion.div className="info-item" variants={itemVariants}>
            <User className="info-icon" />
            <div className="info-content">
              <label>Name</label>
              <p>{user.name}</p>
            </div>
          </motion.div>

          <motion.div className="info-item" variants={itemVariants}>
            <Mail className="info-icon" />
            <div className="info-content">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
          </motion.div>

          <motion.div className="button-group" variants={itemVariants}>
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="dashboard-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MdDashboard className="btn-icon" />
              <span>Dashboard</span>
            </motion.button>

            {user.role === "admin" && (
              <motion.button
                onClick={() => navigate("/admin/dashboard")}
                className="admin-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdDashboard className="btn-icon" />
                <span>Admin Dashboard</span>
              </motion.button>
            )}

            <motion.button
              onClick={() => logoutUser(navigate)}
              className="logout-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoMdLogOut className="btn-icon" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
