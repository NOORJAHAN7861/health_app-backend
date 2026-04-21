import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

  email: {
  type: String,
  required: [true, "Email Is Required!"],
  validate: [validator.isEmail, "Provide A Valid Email!"],
  unique: true,
},


    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[0-9]{11}$/.test(v),
        message: "Phone Number Must Be Exactly 11 Digits!",
      },
    },

    nic: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[0-9]{13}$/.test(v),
        message: "NIC Must Be Exactly 13 Digits!",
      },
    },

    dob: { type: Date, required: true },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      required: true,
    },

    doctorDepartment: {
      type: String,
      required: function () {
        return this.role === "Doctor";
      },
    },
  },
  { timestamps: true }
);

// ✅ MUST be before model creation
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);