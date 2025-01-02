import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User Already exists",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = {
    name,
    email,
    password: hashPassword,
  };

  const otp = Math.floor(Math.random() * 1000000);

  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  const data = {
    name,
    otp,
  };

  await sendMail(email, "E learning", data);

  res.status(200).json({
    message: "Otp send to your mail",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if (!verify)
    return res.status(400).json({
      message: "Otp Expired",
    });

  if (verify.otp !== otp)
    return res.status(400).json({
      message: "Wrong Otp",
    });

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.json({
    message: "User Registered",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "No User with this email",
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res.status(400).json({
      success: false,
      message: "Wrong Password",
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  // Remove password from user object
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(200).json({
    success: true,
    message: `Welcome back ${user.name}`,
    token,
    user: userWithoutPassword,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({ user });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "User not found",
    });

  const otp = Math.floor(Math.random() * 1000000);

  const resetToken = jwt.sign(
    {
      _id: user._id,
      otp,
    },
    process.env.Reset_Secret,
    {
      expiresIn: "15m",
    }
  );

  const data = {
    name: user.name,
    otp,
  };

  await sendForgotMail(email, "Reset Password", data);

  res.status(200).json({
    message: "Reset link send to your mail",
    resetToken,
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { otp, resetToken, password } = req.body;

  const decoded = jwt.verify(resetToken, process.env.Reset_Secret);

  if (decoded.otp !== otp)
    return res.status(400).json({
      message: "Invalid OTP",
    });

  const user = await User.findById(decoded._id);

  const hashPassword = await bcrypt.hash(password, 10);

  user.password = hashPassword;

  await user.save();

  res.json({ message: "Password Reset" });
});

export const getStudentStats = TryCatch(async (req, res) => {
  const user = req.user;

  // Get all progress records for this user
  const progress = await Progress.find({ user: user._id }).populate('course completedLectures');
  
  // Calculate total lectures attended
  const totalLecturesAttended = progress.reduce((total, p) => total + p.completedLectures.length, 0);
  
  // Calculate total courses enrolled
  const totalCourses = progress.length;

  res.status(200).json({
    success: true,
    totalLecturesAttended,
    totalCourses,
  });
});
