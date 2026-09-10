const express = require("express");
const router = express.Router();
const {
  getStaffComplaints,
  updateStaffStatus,
  resolveComplaint,
} = require("../controllers/staffController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All staff routes are protected and restricted to role: staff
router.use(protect);
router.use(authorize("staff"));

router.get("/complaints", getStaffComplaints);
router.put("/complaints/:id/status", updateStaffStatus);
router.put("/complaints/:id/resolve", resolveComplaint);

module.exports = router;
