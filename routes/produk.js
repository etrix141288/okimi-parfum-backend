import express from "express";
import Produk from "../models/Produk.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "okimiparfumsecret";

// Middleware auth
function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET semua produk
router.get("/", async (req, res) => {
  const produk = await Produk.find();
  res.json(produk);
});

// POST produk baru dengan gambar
router.post("/", auth, upload.single("gambar"), async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;
    const gambar = req.file ? "/uploads/" + req.file.filename : null;

    const produk = new Produk({ nama, harga, stok, gambar });
    await produk.save();

    res.json({ message: "Produk dibuat", produk });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
