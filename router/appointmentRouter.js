import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";

import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Patient books appointment
router.post(
  "/post",
  isAuthenticated,
  isAuthorized("Patient"),
  postAppointment
);

// ✅ All roles can view their own appointments
router.get(
  "/getall",
  isAuthenticated,
  isAuthorized("Admin", "Doctor", "Patient"),
  getAllAppointments
);

// ✅ Only Admin & Doctor can update status
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin", "Doctor"),
  updateAppointmentStatus
);

// ✅ Admin, Doctor (own), Patient (own) can delete (checked in controller)
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin", "Doctor", "Patient"),
  deleteAppointment
);

export default router;
