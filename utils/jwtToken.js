import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  // Create JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  // Cookie expiry in ms (default 7 days)
  const cookieExpire =
    Number(process.env.COOKIE_EXPIRY || 7) * 24 * 60 * 60 * 1000;

  // ✅ expires must be a Date object
  res.cookie("token", token, {
    expires: new Date(Date.now() + cookieExpire),
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

