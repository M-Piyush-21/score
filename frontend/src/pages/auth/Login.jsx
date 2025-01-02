import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchMyCourse } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate, fetchMyCourse);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Welcome Back!</h1>
        <p>Sign in to continue your learning journey</p>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>
              <FiMail />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <FiLock />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button disabled={btnLoading} type="submit" className="auth-btn">
            {btnLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="auth-links">
          New to our platform?
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
