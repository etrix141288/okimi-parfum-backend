import mongoose from "mongoose";

const ProdukSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  harga: { type: Number, required: true },
  stok: { type: Number, required: true },
  gambar: { type: String } // path file upload
}, { timestamps: true });

export default mongoose.model("Produk", ProdukSchema);
