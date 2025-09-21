import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import produkRoutes from "./routes/produk.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: ["https://okimi-parfum.netlify.app"],
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/produk", produkRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// MongoDB connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// UI
app.get("/", (req, res) => {
  res.send(`<h1>🚀 OKIMI Parfum API</h1><p>Check <a href="/healthz">/healthz</a></p>`);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
