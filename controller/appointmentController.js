import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Appointment } from "../models/appointmentSchema.js"; 
import {User }from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    appointment_date,
    department,
    doctorId,
    hasVisited = false,
    address,
  } = req.body;

  if (!appointment_date || !department || !doctorId || !address) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const doctor = await User.findOne({
    _id: doctorId,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  const appointment = await Appointment.create({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    phone: req.user.phone,
    nic: req.user.nic,
    dob: req.user.dob,
    gender: req.user.gender,
    appointment_date: new Date(appointment_date),
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

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected"].includes(status)) {
    return next(new ErrorHandler("Invalid status value!", 400));
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  if (req.user.role === "Patient") {
    return next(new ErrorHandler("Patients cannot update status!", 403));
  }

  if (
    req.user.role === "Doctor" &&
    appointment.doctorId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("Not Authorized!", 403));
  }

  const updated = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `Appointment ${status}!`,
    appointment: updated,
  });
});


export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }

  const isAdmin = req.user.role === "Admin";

  const isPatientOwner =
    appointment.patientId.toString() === req.user._id.toString();

  const isDoctorOwner =
    appointment.doctorId.toString() === req.user._id.toString();

  if (!isAdmin && !isPatientOwner && !isDoctorOwner) {
    return next(new ErrorHandler("Not Authorized!", 403));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment Deleted Successfully!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  let appointments;

  // ✅ Admin can see all appointments
  if (req.user.role === "Admin") {
    appointments = await Appointment.find();
  }

  // ✅ Doctor can see only their appointments
  else if (req.user.role === "Doctor") {
    appointments = await Appointment.find({ doctorId: req.user._id });
  }

  // ✅ Patient can see only their own appointments
  else if (req.user.role === "Patient") {
    appointments = await Appointment.find({ patientId: req.user._id });
  }

  else {
    return next(new ErrorHandler("Not Authorized!", 403));
  }

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});
