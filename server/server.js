// server/server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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

// =========================================================
// === 1. DEFINE API ROUTES FIRST ==========================
// =========================================================
app.use("/api/calculations", calcRoutes);


// =========================================================
// === 2. SERVE REACT APP (The "catch-all" handler) ========
// === THIS MUST BE LAST, AFTER ALL API ROUTES ============
// =========================================================
if (process.env.NODE_ENV === "production") {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  // Handles any requests that don't match the ones above
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// =========================================================
// === 3. START THE SERVER =================================
// =========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));