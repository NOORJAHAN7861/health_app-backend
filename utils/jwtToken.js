export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieExpire =
    Number(process.env.COOKIE_EXPIRE || 7) *
    24 *
    60 *
    60 *
    1000;

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpire),
      httpOnly: true,
      secure: true,       // REQUIRED for Render HTTPS
      sameSite: "None",   // REQUIRED for Vercel → Render
    })
    .json({
      success: true,
      message,
      user,
    });
};