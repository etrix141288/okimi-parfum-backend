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
  res.send(`
    <html>
      <head>
        <title>OKIMI Parfum Backend</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #fafafa; }
          h1 { color: #333; }
          form { margin-top: 15px; padding: 15px; background: #fff; border-radius: 5px; }
          input { margin: 5px 0; padding: 8px; width: 100%; }
          button { padding: 8px 15px; background: #28a745; color: white; border: none; cursor: pointer; }
          .result { background: #272822; color: #f8f8f2; padding: 10px; margin-top: 10px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>OKIMI Parfum API</h1>

        <h2>Login</h2>
        <form id="loginForm">
          <h3>Username</h3>
          <input id="loginUser" value="" />
          <h3>Password</h3>
          <input id="loginPass" type="password" value="" />
          <button type="submit">Login</button>
        </form>
        <div id="loginResult" class="result"></div>

        <h2>Tambah Produk</h2>
        <form id="produkForm" enctype="multipart/form-data">
          <input type="text" id="produkNama" placeholder="Nama Produk" required />
          <input type="number" id="produkHarga" placeholder="Harga" required />
          <input type="number" id="produkStok" placeholder="Stok" required />
          <input type="file" id="produkGambar" required />
          <input type="text" id="produkToken" placeholder="Bearer Token" required />
          <button type="submit">Upload Produk</button>
        </form>
        <div id="produkResult" class="result"></div>

        <script>
          async function postLogin() {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: document.getElementById("loginUser").value,
                password: document.getElementById("loginPass").value
              })
            });
            return res.json();
          }

          document.getElementById("loginForm").addEventListener("submit", async e => {
            e.preventDefault();
            const result = await postLogin();
            document.getElementById("loginResult").innerText = JSON.stringify(result, null, 2);
            if(result.token) document.getElementById("produkToken").value = result.token;
          });

          document.getElementById("produkForm").addEventListener("submit", async e => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("nama", document.getElementById("produkNama").value);
            formData.append("harga", document.getElementById("produkHarga").value);
            formData.append("stok", document.getElementById("produkStok").value);
            formData.append("gambar", document.getElementById("produkGambar").files[0]);

            const res = await fetch("/api/produk", {
              method: "POST",
              headers: { "Authorization": "Bearer " + document.getElementById("produkToken").value },
              body: formData
            });
            const result = await res.json();
            document.getElementById("produkResult").innerText = JSON.stringify(result, null, 2);
          });
        </script>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
