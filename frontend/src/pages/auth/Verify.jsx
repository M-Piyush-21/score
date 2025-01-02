import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import { FiLock, FiMail } from "react-icons/fi";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { btnLoading, verifyOtp } = UserData();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function onChange(value) {
    console.log("Captcha value:", value);
    setShow(true);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(Number(otp), navigate);
  };

  return (
    <div className="auth-container">
      <div className="auth-form verify-form">
        <div className="verify-header">
          <FiMail className="verify-icon" />
          <h1>Verify Account</h1>
          <p>Enter the OTP sent to your email address</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>
              <FiLock />
              Enter OTP
            </label>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              className="otp-input"
            />
          </div>

          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onChange}
              theme="dark"
              className="recaptcha-container"
            />
          </div>

          {show && (
            <button disabled={btnLoading} type="submit" className="auth-btn">
              {btnLoading ? "Verifying..." : "Verify Account"}
            </button>
          )}
        </form>
        
        <div className="auth-links">
          <Link to="/login" className="back-link">
            <span>←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
