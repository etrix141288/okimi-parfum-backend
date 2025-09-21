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

// Interactive API Docs Page
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
          pre { background: #272822; color: #f8f8f2; padding: 10px; border-radius: 5px; overflow-x: auto; }
          a.try-btn {
            background: #007acc; color: white; padding: 5px 10px; border-radius: 4px;
            text-decoration: none; font-size: 14px; margin-left: 10px;
          }
          a.try-btn:hover { background: #005f99; }
          form { background: #fff; padding: 15px; border-radius: 5px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          input, textarea { width: 100%; padding: 8px; margin: 5px 0 10px; border: 1px solid #ccc; border-radius: 4px; }
          button { background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background: #218838; }
          .result { background: #272822; color: #f8f8f2; padding: 10px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap; }
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
            <th>Try</th>
          </tr>
          <tr>
            <td>Produk</td>
            <td>GET</td>
            <td class="endpoint">/api/produk</td>
            <td>List semua produk</td>
            <td><a class="try-btn" href="/api/produk" target="_blank">Try</a></td>
          </tr>
          <tr>
            <td>Auth</td>
            <td>POST</td>
            <td class="endpoint">/api/auth/register</td>
            <td>Register user baru</td>
            <td>Form ↓</td>
          </tr>
          <tr>
            <td>Auth</td>
            <td>POST</td>
            <td class="endpoint">/api/auth/login</td>
            <td>Login user</td>
            <td>Form ↓</td>
          </tr>
          <tr>
            <td>Produk</td>
            <td>POST</td>
            <td class="endpoint">/api/produk</td>
            <td>Buat produk baru</td>
            <td>Form ↓</td>
          </tr>
          <tr>
            <td>Health</td>
            <td>GET</td>
            <td class="endpoint">/healthz</td>
            <td>Health check</td>
            <td><a class="try-btn" href="/healthz" target="_blank">Try</a></td>
          </tr>
        </table>

        <h2>🔹 Test API</h2>

        <h3>Register User</h3>
        <form id="registerForm">
          <input type="text" id="regUsername" placeholder="Username" required />
          <input type="password" id="regPassword" placeholder="Password" required />
          <button type="submit">Send</button>
        </form>
        <div id="registerResult" class="result"></div>

        <h3>Login User</h3>
        <form id="loginForm">
          <input type="text" id="loginUsername" placeholder="Username" required />
          <input type="password" id="loginPassword" placeholder="Password" required />
          <button type="submit">Send</button>
        </form>
        <div id="loginResult" class="result"></div>

        <h3>Create Produk</h3>
        <form id="produkForm">
          <input type="text" id="produkNama" placeholder="Nama Produk" required />
          <input type="number" id="produkHarga" placeholder="Harga" required />
          <input type="number" id="produkStok" placeholder="Stok" required />
          <button type="submit">Send</button>
        </form>
        <div id="produkResult" class="result"></div>

        <script>
          // Helper for POST requests
          async function postData(url = "", data = {}) {
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
            return response.json();
          }

          // Register Form
          document.getElementById("registerForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
              username: document.getElementById("regUsername").value,
              password: document.getElementById("regPassword").value
            };
            const result = await postData("/api/auth/register", data);
            document.getElementById("registerResult").innerText = JSON.stringify(result, null, 2);
          });

          // Login Form
          document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
              username: document.getElementById("loginUsername").value,
              password: document.getElementById("loginPassword").value
            };
            const result = await postData("/api/auth/login", data);
            document.getElementById("loginResult").innerText = JSON.stringify(result, null, 2);
          });

          // Produk Form
          document.getElementById("produkForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
              nama: document.getElementById("produkNama").value,
              harga: parseInt(document.getElementById("produkHarga").value),
              stok: parseInt(document.getElementById("produkStok").value)
            };
            const result = await postData("/api/produk", data);
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
