import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  // Create JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" } // token itself expires in 1 day
  );

  // Convert COOKIE_EXPIRY (days) → milliseconds
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRY || "7", 10);
  const cookieExpireMs = cookieExpireDays * 24 * 60 * 60 * 1000;

  // ✅ Use expires with a Date object
  res.cookie("token", token, {
    expires: new Date(Date.now() + cookieExpireMs), // 7 days from now
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(statusCode).json({
    success: true,
    message,
    user,
  });
};


