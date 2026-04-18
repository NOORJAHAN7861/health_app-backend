import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Appointment } from "../models/appointmentSchema.js"; 
import {User }from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";



export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated!", 401));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctorId,
    hasVisited = false,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctorId ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Find doctor by ID (correct way)
  const doctor = await User.findOne({
    _id: doctorId,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor.firstName,
      lastName: doctor.lastName,
    },
    hasVisited,
    address,
    doctorId: doctor._id,
    patientId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Appointment Sent Successfully!",
    appointment,
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  let appointments;

  if (req.user.role === "Admin") {
    appointments = await Appointment.find();
  }

  else if (req.user.role === "Doctor") {
    appointments = await Appointment.find({ doctorId: req.user._id });
  }

  else if (req.user.role === "Patient") {
    appointments = await Appointment.find({ patientId: req.user._id });
  }

  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    // Permission check
    if (
      req.user.role === "Patient" ||
      (req.user.role === "Doctor" &&
        appointment.doctorId.toString() !== req.user._id.toString())
    ) {
      return next(new ErrorHandler("Not Authorized!", 403));
    }

    await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);



export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }

  // Permission check
  if (
    req.user.role !== "Admin" &&
    appointment.patientId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("Not Authorized!", 403));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
