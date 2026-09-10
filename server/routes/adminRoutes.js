const express = require("express");
const router = express.Router();
const {
  getStats,
  getStaffList,
  assignStaff,
  updatePriority,
  updateStatus,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes are protected and restricted to role: admin
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getStats);
router.get("/staff", getStaffList);
router.put("/complaints/:id/assign", assignStaff);
router.put("/complaints/:id/priority", updatePriority);
router.put("/complaints/:id/status", updateStatus);

module.exports = router;
