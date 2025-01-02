import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import { Menu, X, LogOut, User, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './navbar.css';

const Navbar = () => {
  const { user, setIsAuth, setUser } = UserData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser(null);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <BookOpen className="logo-icon" />
          <Sparkles className="sparkle-icon" />
          <motion.span 
            className="logo-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Course Hub
          </motion.span>
        </Link>

        <motion.button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>

        <AnimatePresence>
          <motion.div 
            className={`nav-links ${isMenuOpen ? 'active' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="nav-links-group">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/courses" className="nav-link">Courses</Link>
              <Link to="/live-session" className="nav-link">Live Sessions</Link>
            </motion.div>
            
            {user ? (
              <motion.div 
                className="user-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="nav-link admin-link">
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="profile-link">
                  <User className="icon" />
                  <span>{user.name}</span>
                </Link>
                <motion.button 
                  onClick={handleLogout}
                  className="logout-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="icon" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="auth-buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/login">
                  <motion.button 
                    className="login-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button 
                    className="register-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
