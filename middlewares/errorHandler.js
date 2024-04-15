const globalErrorHandler = (err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  if (process.env.NODE_ENV !== "development") {
    res.status(status).json({ message });
  } else {
    res.status(status).json({ msg: message, data: err.data, stack: err.stack });
  }
};

export default globalErrorHandler;
