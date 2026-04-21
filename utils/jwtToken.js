import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  // Create JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  // Ensure COOKIE_EXPIRY is a number (days)
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRY || 7);
  const cookieExpireMs = cookieExpireDays * 24 * 60 * 60 * 1000; // ✅ convert to ms

  res.cookie("token", token, {
    maxAge: cookieExpireMs, // must be a number in ms
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(statusCode).json({
    success: true,
    message,
    user,
  });
};


