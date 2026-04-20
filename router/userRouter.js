import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutUser,
  patientRegister,
} from "../controller/userController.js";

import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);

// Admin creates users
router.post(
  "/admin/addnew",
  isAuthenticated,
  isAuthorized("Admin"),
  addNewAdmin
);

router.post(
  "/doctor/addnew",
  isAuthenticated,
  isAuthorized("Admin"),
  addNewDoctor
);

// Public
router.get("/doctors", getAllDoctors);

// Logged in user details
router.get(
  "/patient/me",
  isAuthenticated,
  isAuthorized("Patient"),
  getUserDetails
);

router.get(
  "/admin/me",
  isAuthenticated,
  isAuthorized("Admin"),
  getUserDetails
);

router.get("/logout", isAuthenticated, logoutUser);

export default router;
