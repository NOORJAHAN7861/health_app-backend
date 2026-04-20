import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minlength: 3,
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minlength: 3,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Provide a valid email"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      validate: {
        validator: (v) => /^[0-9]{11}$/.test(v),
        message: "Phone must be exactly 11 digits",
      },
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: 10,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
