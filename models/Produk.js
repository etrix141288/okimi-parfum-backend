import mongoose from "mongoose";

const ProdukSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, required: true },
  harga: { type: Number, required: true },
  kategori: { type: String, required: true },
  gambar: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Produk", ProdukSchema);
