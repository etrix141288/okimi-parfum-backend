import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import produkRoutes from "./routes/produk.js";
import authRoutes from "./routes/auth.js";

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/produk", produkRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://okimi:noesajalah@ac-nvqmtge-shard-00-00.vrjz2x5.mongodb.net:27017,ac-nvqmtge-shard-00-01.vrjz2x5.mongodb.net:27017,ac-nvqmtge-shard-00-02.vrjz2x5.mongodb.net:27017/?ssl=true&replicaSet=atlas-gkm77n-shard-0&authSource=admin&retryWrites=true&w=majority&appName=OKIMI", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));
