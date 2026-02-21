class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
 

  // Duplicate Key Error (MongoDB)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Invalid
  if (err.name === "JsonWebTokenError") {
    const message = "json web token is invalid, try again!";
    err = new ErrorHandler(message, 400);
  }

  // JWT Expired
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Json Web Token is expired, Try again!", 400);
  }

  // Invalid Mongo ID
  if (err.name === "Cast error") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
return res.status(err.statusCode).json({
  success:false,
  message:err.message,

});
  
};

export default ErrorHandler;



