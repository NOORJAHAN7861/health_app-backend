import jwt from "jsonwebtoken";

export const generateToken = (user, message, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const cookieExpire =
    Number(process.env.COOKIE_EXPIRY || 7) * 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpire),
      httpOnly: true,
      secure: true,       // required for HTTPS
      sameSite: "None",   // required for cross-origin cookies
    })
    .json({
      success: true,
      message,
      user,
    });
};
