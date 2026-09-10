const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router
  .route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;
