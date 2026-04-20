import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

// ✅ Single authentication middleware for all users
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  req.user = user;
  next();
});

// ✅ Role-based authorization
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`,
          403
        )
      );
    }
    next();
  };
};