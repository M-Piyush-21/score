import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import Razorpay from 'razorpay';
import { Courses } from '../models/Courses.js';
import { User } from '../models/User.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.Razorpay_Key || "rzp_test_yGKeiSezHx0H7U",
  key_secret: process.env.Razorpay_Secret || "1R8StMgpfLvotCuKcKLlVjiB"
});

// Create order for checkout
router.post('/checkout/:id', isAuth, async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if user already has access to the course
    const user = await User.findById(req.user._id);
    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: "You already have access to this course"
      });
    }

    const amount = course.price * 100; // Convert to paise

    const options = {
      amount,
      currency: "INR",
      receipt: `course_${course._id}`,
      notes: {
        courseId: course._id.toString(),
        userId: req.user._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "Could not create order",
      error: error.message
    });
  }
});

// Verify payment
router.post('/verification/:id', isAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details"
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_Secret || "1R8StMgpfLvotCuKcKLlVjiB")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Add course to user's subscriptions
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { subscription: req.params.id }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
});

export default router;
