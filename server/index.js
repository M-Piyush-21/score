import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema.js';

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// using middlewares
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight']
}));

// Debug middleware for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, apollo-require-preflight'
  );
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// GraphQL endpoint
app.use('/api/graphql', createHandler({
  schema,
  context: async ({ req }) => {
    return {
      req,
      // Add any other context you need
    };
  }
}));

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/studentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", courseRoutes);
app.use("/api", paymentRoutes);
app.use("/api/student", studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const port = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
