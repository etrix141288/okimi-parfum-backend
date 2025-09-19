import express from "express";
import Produk from "../models/Produk.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Ambil semua produk
router.get("/", async (req, res) => {
  const produk = await Produk.find();
  res.json(produk);
});

// Tambah produk
router.post("/", upload.single("gambar"), async (req, res) => {
  const { nama, deskripsi, harga, kategori } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : "";
  const newProduk = new Produk({ nama, deskripsi, harga, kategori, gambar });
  await newProduk.save();
  res.json(newProduk);
});

// Update produk
router.put("/:id", upload.single("gambar"), async (req, res) => {
  const { nama, deskripsi, harga, kategori } = req.body;
  const updateData = { nama, deskripsi, harga, kategori };
  if(req.file) updateData.gambar = `/uploads/${req.file.filename}`;
  const updated = await Produk.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
});

// Hapus produk
router.delete("/:id", async (req, res) => {
  await Produk.findByIdAndDelete(req.params.id);
  res.json({ message: "Produk dihapus" });
});

export default router;
