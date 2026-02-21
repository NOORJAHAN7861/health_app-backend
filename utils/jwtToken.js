export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

   const cookieName =
    user.role === "Admin" ? "adminToken" : "patientToken";

  // Determine the cookie name based on the user's role
  const cookieExpire =
    Number(process.env.COOKIE_EXPIRE || 7) *
    24 *
    60 *
    60 *
    1000;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + cookieExpire),
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};