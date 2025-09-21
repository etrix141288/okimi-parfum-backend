import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import produkRoutes from "./routes/produk.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/produk", produkRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Default API documentation page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>OKIMI Parfum Backend API</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #fafafa; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
          .endpoint { font-family: monospace; color: #007acc; }
        </style>
      </head>
      <body>
        <h1>OKIMI Parfum Backend</h1>
        <p>Status: ✅ Running</p>
        <p>Version: 1.0.0</p>

        <h2>Available Endpoints</h2>
        <table>
          <tr>
            <th>Category</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Description</th>
          </tr>
          <tr>
            <td>Produk</td>
            <td>GET</td>
            <td class="endpoint">/api/produk</td>
            <td>List semua produk</td>
          </tr>
          <tr>
            <td>Produk</td>
            <td>GET</td>
            <td class="endpoint">/api/produk/:id</td>
            <td>Detail produk by ID</td>
          </tr>
          <tr>
            <td>Produk</td>
            <td>POST</td>
            <td class="endpoint">/api/produk</td>
            <td>Buat produk baru</td>
          </tr>
          <tr>
            <td>Produk</td>
            <td>PUT</td>
            <td class="endpoint">/api/produk/:id</td>
            <td>Update produk</td>
          </tr>
          <tr>
            <td>Produk</td>
            <td>DELETE</td>
            <td class="endpoint">/api/produk/:id</td>
            <td>Hapus produk</td>
          </tr>
          <tr>
            <td>Auth</td>
            <td>POST</td>
            <td class="endpoint">/api/auth/register</td>
            <td>Register user baru</td>
          </tr>
          <tr>
            <td>Auth</td>
            <td>POST</td>
            <td class="endpoint">/api/auth/login</td>
            <td>Login user</td>
          </tr>
          <tr>
            <td>Health</td>
            <td>GET</td>
            <td class="endpoint">/healthz</td>
            <td>Health check</td>
          </tr>
        </table>
      </body>
    </html>
  `);
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
