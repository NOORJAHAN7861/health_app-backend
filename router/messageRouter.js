import express from "express";
import {
  getAllMessages,
  sendMessage,
} from "../controller/messageController.js";

import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Only logged-in Patients can send messages
router.post(
  "/send",
  isAuthenticated,
  isAuthorized("Patient"),
  sendMessage
);

// ✅ Only Admin can view all messages
router.get(
  "/getall",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllMessages
);

export default router;