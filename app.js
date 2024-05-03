import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import contactsRouter from "./routes/contactsRouter.js";
import globalErrorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// DATABASE
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// MIDDLEWARE
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// BUILT-IN
app.use(cors());
app.use(express.json());

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
const pathPrefix = "/api/v1";
app.use(`${pathPrefix}/contacts`, contactsRouter);
app.use(`${pathPrefix}/users`, authRouter);

//ERROR HANDLERS
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(globalErrorHandler);

// SERVER INIT
const port = +process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
