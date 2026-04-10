import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import cloudinary from "cloudinary";

const app = express();

// ✅ ENV
config({ path: "./config/config.env" });

// ✅ DB
dbConnection();

// ✅ Body parsers FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================================================
   ✅ CORS (VERY IMPORTANT FOR RENDER + COOKIES)
======================================================= */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed: " + origin));
      }
    },
    credentials: true,
  })
);

/* =======================================================
   ✅ FILE UPLOAD (must be AFTER cors & body parser)
======================================================= */
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // required for Render
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

/* =======================================================
   ✅ Cloudinary Config
======================================================= */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =======================================================
   ✅ Routes
======================================================= */
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

/* =======================================================
   ✅ Error Middleware LAST
======================================================= */
app.use(errorMiddleware);

export default app;