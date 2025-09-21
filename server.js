// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import produkRoutes from "./routes/produk.js";
import authRoutes from "./routes/auth.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ===== CORS =====
app.use(cors({
  origin: [
    "https://okimi-parfum.netlify.app", // frontend Netlify
    "http://localhost:5173" // frontend local dev
  ]
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ===== Routes =====
app.use("/api/produk", produkRoutes);
app.use("/api/auth", authRoutes);

// ===== Health check =====
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ===== MongoDB connection =====
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Optional UI for quick testing =====
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>OKIMI Parfum Backend</title></head>
      <body>
        <h1>✅ Backend Running</h1>
        <p>Health: <a href="/healthz">Check</a></p>
        <p>Use Postman or frontend to test API.</p>
      </body>
    </html>
  `);
});

// ===== Start server =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(\`🚀 Server running on port \${PORT}`);
});
