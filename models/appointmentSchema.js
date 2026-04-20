import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name Is Required!"],
      minlength: 3,
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last Name Is Required!"],
      minlength: 3,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email Is Required!"],
      validate: [validator.isEmail, "Provide A Valid Email!"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone Is Required!"],
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: "Phone must be exactly 10 digits",
      },
    },

    nic: {
      type: String,
      required: [true, "NIC Is Required!"],
      validate: {
        validator: (v) => /^[0-9]{13}$/.test(v),
        message: "NIC must be exactly 13 digits",
      },
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },

    appointment_date: {
      type: Date,
      required: true,
      index: true,
    },

    department: {
      type: String,
      required: true,
      index: true,
    },

    hasVisited: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// 🔥 Compound index (important for dashboard queries)
appointmentSchema.index({ doctorId: 1, appointment_date: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
