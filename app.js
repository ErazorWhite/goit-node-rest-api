import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// ROUTES
const pathPrefix = "/api/v1";

app.use(`${pathPrefix}/contacts`, contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// SERVER INIT
const port = +process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
