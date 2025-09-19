import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "okimiparfumsecret";

// Inisialisasi admin awal (okimi / noesajalah)
router.post("/init", async (req, res) => {
  const existing = await Admin.findOne({ username: "okimi" });
  if(existing) return res.json({ message: "Admin sudah ada" });

  const hash = await bcrypt.hash("noesajalah", 10);
  const admin = new Admin({ username: "okimi", password: hash });
  await admin.save();
  res.json({ message: "Admin dibuat" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if(!admin) return res.status(400).json({ message: "Admin tidak ditemukan" });

  const valid = await bcrypt.compare(password, admin.password);
  if(!valid) return res.status(400).json({ message: "Password salah" });

  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

export default router;
