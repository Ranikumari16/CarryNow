const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const axios = require("axios");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- LOCAL EXCEL FILE (.XLSX) SETUP ---
const excelFilePath = path.join(__dirname, 'CarryNow.xlsx');

// Ensure CarryNow.xlsx exists with headers
if (!fs.existsSync(excelFilePath)) {
  const initialHeaders = [["Full Name", "Email Address", "Registration Date", "Status"]];
  const ws = XLSX.utils.aoa_to_sheet(initialHeaders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, excelFilePath);
  console.log("📁 Created CarryNow.xlsx Excel file with initial headers!");
}

// MongoDB Connection (Optional/Fallback safe)
mongoose.connect("mongodb://localhost:27017/carrynow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// In-Memory Orders Array for Tracking & Users
let ordersList = [];
let registeredUsers = [];

// Real-time Chat Connection
io.on("connection", (socket) => {
  console.log(`User connected to chat: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    
    const userMsg = data.text ? data.text.toLowerCase() : "";
    let replyText = "";

    if (userMsg.includes("hello") || userMsg.includes("hi") || userMsg.includes("hey")) {
      replyText = "Hello! Welcome to CarryNow. How can I help you deliver your personal belongings today?";
    } else if (userMsg.includes("price") || userMsg.includes("cost") || userMsg.includes("charge")) {
      replyText = "Delivery charges are calculated based on distance and parcel size. You can see the estimated fee on our 'Book Parcel' page.";
    } else if (userMsg.includes("track") || userMsg.includes("status")) {
      replyText = "You can track your order live from the Customer Dashboard or by using your Order ID.";
    } else if (userMsg.includes("time") || userMsg.includes("fast") || userMsg.includes("urgent")) {
      replyText = "Local campus and city deliveries are usually fulfilled within 1 to 3 hours!";
    } else if (userMsg.includes("contact") || userMsg.includes("email") || userMsg.includes("phone number")) {
      replyText = "You can reach CarryNow support team at phone: +91 960880XXXX or email us at support@carrynowservice.in.";
    } else {
      replyText = "Thanks for your message! Our CarryNow support team will get back to you shortly regarding this.";
    }

    setTimeout(() => {
      socket.emit("receive_message", { 
        sender: "bot", 
        text: replyText 
      });
    }, 800);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const Razorpay = require("razorpay");

// Dummy Test Credentials
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_dummyKey123456",
  key_secret: "dummySecretKey123456"
});

// Create Payment Order API Endpoint
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const mockOrder = {
      id: "order_mock_" + Math.floor(100000 + Math.random() * 900000),
      entity: "order",
      amount: Math.round(amount * 100),
      currency: "INR",
      status: "created"
    };

    res.json({ success: true, order: mockOrder });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save Order API Endpoint
app.post("/api/orders/create", (req, res) => {
  const newOrder = req.body;
  ordersList.push(newOrder);
  res.json({ success: true, message: "Order saved successfully", orderId: newOrder.orderId });
});

// Track Order API Endpoint
app.get("/api/orders/track/:orderId", (req, res) => {
  const { orderId } = req.params;
  const order = ordersList.find(o => o.orderId && o.orderId.trim().toLowerCase() === orderId.trim().toLowerCase());

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found with this ID." });
  }
  res.json({ success: true, order });
});

// Google Apps Script Webhook URL
// --- REGISTER API ---
// --- REGISTER API (CSV Saving - 100% Working & Clickable) ---
const csvFilePath = path.join(__dirname, 'CarryNow_Users.csv');

// Ensure CSV file exists with headers
if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, 'Full Name,Email Address,Registration Date,Status\n');
}

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Please fill all fields." });
  }

  // Check if user already exists
  const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered! Please Sign In." });
  }

  // 1. Save new user in memory
  const newUser = { name, email: email.toLowerCase(), password };
  registeredUsers.push(newUser);

  const registrationTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // 2. Append directly to CSV file (Opens nicely in Excel)
  try {
    const csvRow = `"${name}","${email.toLowerCase()}","${registrationTime}","Active"\n`;
    fs.appendFileSync(csvFilePath, csvRow);
    console.log(`✅ Saved ${email} to CarryNow_Users.csv successfully!`);
  } catch (err) {
    console.error("Error writing to CSV:", err.message);
  }

  res.json({ 
    success: true, 
    message: "Registration successful!", 
    user: { name: newUser.name, email: newUser.email } 
  });
});
// Login API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please enter email and password." });
  }

  const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: "Account does not exist with this email. Please Create an Account first!" });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: "Incorrect password! Please try again." });
  }

  res.json({ success: true, user: { name: user.name, email: user.email } });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "CarryNow Express & Socket.io server is running!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});