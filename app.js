import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import contactsRouter from "./routes/contactsRouter.js";
import globalErrorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// DATABASE
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// MIDDLEWARE
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// BUILT-IN
app.use(cors());
app.use(express.json());

// ROUTES
const pathPrefix = "/api/v1";

app.use(`${pathPrefix}/contacts`, contactsRouter);

// handle not found error
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(globalErrorHandler);

// SERVER INIT
const port = +process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
