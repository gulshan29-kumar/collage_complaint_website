const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a complaint title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a complaint description"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Electrical",
        "Internet/Wi-Fi",
        "Plumbing",
        "Cleaning",
        "Hostel",
        "Classroom",
        "Furniture",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Please specify the location (e.g. Hostel B - Room 204)"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolutionNote: {
      type: String,
      default: "",
      trim: true,
    },
    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
