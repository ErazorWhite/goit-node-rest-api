import colors from "colors";

export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

export const catchAsyncService =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(colors.red("Error:"), error.message);
      throw error;
    }
  };
