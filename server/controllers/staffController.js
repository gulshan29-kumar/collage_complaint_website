const Complaint = require("../models/Complaint");

// @desc    Get complaints assigned to logged-in staff
// @route   GET /api/staff/complaints
// @access  Private (Staff)
const getStaffComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user._id })
      .populate("student", "name email")
      .sort({ updatedAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("Get staff complaints error:", error);
    res.status(500).json({ message: "Server error fetching staff complaints" });
  }
};

// @desc    Update complaint status by staff (e.g. In Progress)
// @route   PUT /api/staff/complaints/:id/status
// @access  Private (Staff)
const updateStaffStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Verify assigned to this staff member
    if (
      !complaint.assignedTo ||
      complaint.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "This complaint is not assigned to you" });
    }

    complaint.status = status || "In Progress";
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    res.json(updated);
  } catch (error) {
    console.error("Staff status update error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

// @desc    Resolve complaint with resolution note
// @route   PUT /api/staff/complaints/:id/resolve
// @access  Private (Staff)
const resolveComplaint = async (req, res) => {
  try {
    const { resolutionNote } = req.body;

    if (!resolutionNote || resolutionNote.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please provide a resolution note explaining the fix." });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (
      !complaint.assignedTo ||
      complaint.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "This complaint is not assigned to you" });
    }

    complaint.status = "Resolved";
    complaint.resolutionNote = resolutionNote.trim();
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    res.json(updated);
  } catch (error) {
    console.error("Staff resolve error:", error);
    res.status(500).json({ message: "Server error resolving complaint" });
  }
};

module.exports = {
  getStaffComplaints,
  updateStaffStatus,
  resolveComplaint,
};
