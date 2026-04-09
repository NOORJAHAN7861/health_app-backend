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

config({ path: "./config/config.env" });
dbConnection();

// ✅ VERY FIRST — body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS
import cors from "cors";

app.use(
  cors({
    origin: [
      process.env.FRONT_END_URL,
      process.env.ADMIN_DASHBOARD_URL,
    ],
    credentials: true,
  })
);


// ✅ File upload AFTER json
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    parseNested: true,   // ✅ VERY IMPORTANT
  })
);

// ✅ Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

// ✅ Error middleware LAST
app.use(errorMiddleware);

export default app;