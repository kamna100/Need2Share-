
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Request = require("../models/request");
const Donation = require("../models/donation");

// POST: Create a new request
router.post("/", async (req, res) => {
  try {
    const {
      donationId,
      requesterName,
      requesterEmail,
      message,
    } = req.body;

    if (
      !donationId ||
      !mongoose.isValidObjectId(donationId) ||
      !requesterName?.trim() ||
      !requesterEmail?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide valid request details.",
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found.",
      });
    }

    if (donation.status !== "Active") {
      return res.status(409).json({
        message: "This donation is no longer available.",
      });
    }

    const newRequest = new Request({
      donationId,
      requesterName,
      requesterEmail: requesterEmail.trim().toLowerCase(),
      message: message || "",
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Request submitted successfully!",
      request: savedRequest,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to submit request",
      error: error.message,
    });
  }
});

// GET: Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("donationId")
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});

// PATCH: Accept or Reject a request
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected.",
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(409).json({
        message: "This request has already been processed.",
      });
    }

    // REJECT REQUEST
    if (status === "Rejected") {
      const rejectedRequest = await Request.findOneAndUpdate(
        { _id: id, status: "Pending" },
        { $set: { status: "Rejected" } },
        { new: true }
      );

      if (!rejectedRequest) {
        return res.status(409).json({
          message: "Request was already processed.",
        });
      }

      return res.status(200).json({
        message: "Request rejected successfully!",
        request: rejectedRequest,
      });
    }

    // APPROVE REQUEST AND RESERVE DONATION
    const reservedDonation = await Donation.findOneAndUpdate(
      {
        _id: request.donationId,
        status: "Active",
      },
      {
        $set: { status: "Reserved" },
      },
      { new: true }
    );

    if (!reservedDonation) {
      return res.status(409).json({
        message: "This donation is already reserved or unavailable.",
      });
    }

    const approvedRequest = await Request.findOneAndUpdate(
      {
        _id: id,
        status: "Pending",
      },
      {
        $set: { status: "Approved" },
      },
      { new: true }
    );

    if (!approvedRequest) {
      // Restore donation if request approval fails
      await Donation.updateOne(
        {
          _id: request.donationId,
          status: "Reserved",
        },
        {
          $set: { status: "Active" },
        }
      );

      return res.status(409).json({
        message: "Request could not be approved. Please try again.",
      });
    }

    return res.status(200).json({
      message: "Request approved and donation reserved successfully!",
      request: approvedRequest,
      donation: reservedDonation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update request",
      error: error.message,
    });
  }
});

// PATCH: Mark an approved donation as completed
router.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.status !== "Approved") {
      return res.status(409).json({
        message: "Only approved requests can be completed.",
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        _id: request.donationId,
        status: "Reserved",
      },
      {
        $set: { status: "Completed" },
      },
      { new: true }
    );

    if (!donation) {
      return res.status(409).json({
        message: "Reserved donation not found or already completed.",
      });
    }

    const updatedRequest = await Request.findOneAndUpdate(
      {
        _id: id,
        status: "Approved",
      },
      {
        $set: { status: "Completed" },
      },
      { new: true }
    );

    if (!updatedRequest) {
      await Donation.updateOne(
        { _id: donation._id, status: "Completed" },
        { $set: { status: "Reserved" } }
      );

      return res.status(409).json({
        message: "Could not complete request. Please try again.",
      });
    }

    return res.status(200).json({
      message: "Donation completed successfully!",
      request: updatedRequest,
      donation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to complete donation.",
      error: error.message,
    });
  }
});

// PATCH: Receiver submits an optional review
router.patch("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { requesterEmail, rating, comment } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!requesterEmail?.trim()) {
      return res.status(400).json({
        message: "Requester email is required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (
      request.requesterEmail.toLowerCase() !==
      requesterEmail.trim().toLowerCase()
    ) {
      return res.status(403).json({
        message: "Only the receiver can submit this review.",
      });
    }

    if (request.status !== "Completed") {
      return res.status(409).json({
        message: "Review can only be submitted after completion.",
      });
    }

    if (request.reviewSubmitted) {
      return res.status(409).json({
        message: "You have already submitted a review.",
      });
    }

    request.reviewRating = numericRating;
    request.reviewComment = (comment || "").trim();
    request.reviewSubmitted = true;
    request.reviewedAt = new Date();

    await request.save();

    return res.status(200).json({
      message: "Review submitted successfully!",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit review.",
      error: error.message,
    });
  }
});

module.exports = router;

