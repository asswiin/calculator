// server/server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // <-- IMPORT THIS
import { fileURLToPath } from "url"; // <-- IMPORT THIS
import calcRoutes from "./routes/CalcRoute.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// These two lines are needed for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// API routes - These should come BEFORE the static serving
app.use("/api/calculations", calcRoutes);

// --- ADD THIS SECTION FOR PRODUCTION ---
// This code serves the built React app from the 'client/build' folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}
// ----------------------------------------

// Use the port Render provides, or 5000 for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));