
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Donation routes
const donationRoutes = require("./routers/donationRoutes");
const requestRoutes = require("./routers/requestRoutes");

const app = express();

// Create uploads folder
const uploadsPath = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(uploadsPath));

// APIs
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
  res.send("Need2Share backend is running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });
