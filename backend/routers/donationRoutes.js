
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");

const Donation = require("../models/donation");
const Request = require("../models/request");

const uploadsPath = path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload an image file only."));
    }
  },
});

// POST: Create donation with optional image
router.post("/", (req, res) => {
  upload.single("image")(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({
        message: "Image upload failed",
        error: uploadError.message,
      });
    }

    try {
      const donationData = { ...req.body };

      if (req.file) {
        donationData.imageUrl =
          `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      } else {
        donationData.imageUrl = "";
      }

      if (donationData.donorEmail) {
        donationData.donorEmail =
          donationData.donorEmail.trim().toLowerCase();
      }

      const donation = new Donation(donationData);
      const savedDonation = await donation.save();

      return res.status(201).json({
        message: "Donation shared successfully!",
        donation: savedDonation,
      });
    } catch (error) {
      if (req.file) {
        fs.unlink(
          path.join(uploadsPath, req.file.filename),
          () => {}
        );
      }

      return res.status(400).json({
        message: "Failed to create donation",
        error: error.message,
      });
    }
  });
});

// GET: Get all donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    return res.status(200).json(donations);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
});

// DELETE: Delete donation and its related requests
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const donorEmail = String(req.body?.donorEmail || "")
      .trim()
      .toLowerCase();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid donation ID.",
      });
    }

    if (!donorEmail) {
      return res.status(400).json({
        message: "Donor email is required.",
      });
    }

    const donation = await Donation.findOne({
      _id: id,
      donorEmail,
    });

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found or you are not allowed to delete it.",
      });
    }

    const imageUrl = donation.imageUrl;

    // Delete all requests linked to this donation
    await Request.deleteMany({
      donationId: donation._id,
    });

    // Delete donation
    await Donation.deleteOne({
      _id: donation._id,
    });

    // Delete uploaded image
    if (imageUrl) {
      try {
        const imagePath = new URL(imageUrl).pathname;
        const filename = path.basename(decodeURIComponent(imagePath));
        const localFile = path.join(uploadsPath, filename);

        if (filename && fs.existsSync(localFile)) {
          fs.unlink(localFile, () => {});
        }
      } catch (error) {
        console.error("Image cleanup warning:", error.message);
      }
    }

    return res.status(200).json({
      message: "Donation and its related requests deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete donation",
      error: error.message,
    });
  }
});

module.exports = router;
