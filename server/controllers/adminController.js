const Complaint = require("../models/Complaint");
const User = require("../models/User");

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const assigned = await Complaint.countDocuments({ status: "Assigned" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    const rejected = await Complaint.countDocuments({ status: "Rejected" });

    const totalStudents = await User.countDocuments({ role: "student" });
    const totalStaff = await User.countDocuments({ role: "staff" });

    res.json({
      totalComplaints,
      pending,
      assigned,
      inProgress,
      resolved,
      rejected,
      totalStudents,
      totalStaff,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error fetching statistics" });
  }
};

// @desc    Get all staff members for dropdown assignment
// @route   GET /api/admin/staff
// @access  Private (Admin)
const getStaffList = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("_id name email");
    res.json(staff);
  } catch (error) {
    console.error("Get staff list error:", error);
    res.status(500).json({ message: "Server error fetching staff members" });
  }
};

// @desc    Assign staff member to complaint
// @route   PUT /api/admin/complaints/:id/assign
// @access  Private (Admin)
const assignStaff = async (req, res) => {
  try {
    const { staffId, adminNote } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Please select a staff member" });
    }

    const staffUser = await User.findOne({ _id: staffId, role: "staff" });
    if (!staffUser) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedTo = staffId;
    complaint.status = "Assigned";
    if (adminNote !== undefined) {
      complaint.adminNote = adminNote;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    res.json(updatedComplaint);
  } catch (error) {
    console.error("Assign staff error:", error);
    res.status(500).json({ message: "Server error assigning staff" });
  }
};

// @desc    Update complaint priority
// @route   PUT /api/admin/complaints/:id/priority
// @access  Private (Admin)
const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.priority = priority;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error("Update priority error:", error);
    res.status(500).json({ message: "Server error updating priority" });
  }
};

// @desc    Update complaint status
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin)
const updateStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const validStatuses = [
      "Pending",
      "Assigned",
      "In Progress",
      "Resolved",
      "Rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    if (adminNote !== undefined) {
      complaint.adminNote = adminNote;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    res.json(updatedComplaint);
  } catch (error) {
    console.error("Update admin status error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

module.exports = {
  getStats,
  getStaffList,
  assignStaff,
  updatePriority,
  updateStatus,
};
