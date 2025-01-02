import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, authorization denied"
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, authorization denied"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.Jwt_Sec);
      const user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Token is not valid"
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in authentication"
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required"
      });
    }

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in admin authentication"
    });
  }
};
