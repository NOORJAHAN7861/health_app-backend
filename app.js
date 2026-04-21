import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();

// ENV
config({ path: "./config/config.env" });

// DB
dbConnection();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ PERFECT CORS FOR RENDER + VERCEL
const allowedOrigins = [
  "https://health-app-frontend-kappa.vercel.app",
  "https://admin-dashboard-health-b1dz.vercel.app",
  "http://localhost:5173", // add dev origin if needed
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

// Error middleware
app.use(errorMiddleware);

export default app;