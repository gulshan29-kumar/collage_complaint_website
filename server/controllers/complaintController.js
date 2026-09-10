const Complaint = require("../models/Complaint");

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;

    // Friendly validation
    if (!title) {
      return res.status(400).json({ message: "Please enter a complaint title." });
    }
    if (!description) {
      return res
        .status(400)
        .json({ message: "Please enter a complaint description." });
    }
    if (!category) {
      return res.status(400).json({ message: "Please select a category." });
    }
    if (!location) {
      return res
        .status(400)
        .json({ message: "Please specify the location (e.g. Hostel A, Room 102)." });
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      priority: priority || "Medium",
      status: "Pending",
      student: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: "Server error creating complaint" });
  }
};

// @desc    Get complaints (role-aware: Student gets own, Admin gets all, Staff gets assigned)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "student") {
      query.student = req.user._id;
    } else if (req.user.role === "staff") {
      query.assignedTo = req.user._id;
    }
    // Admin gets all complaints without filtering by user

    const complaints = await Complaint.find(query)
      .populate("student", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error("Get complaints error:", error);
    res.status(500).json({ message: "Server error fetching complaints" });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Role-based access check
    if (
      req.user.role === "student" &&
      complaint.student._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Access denied to this complaint" });
    }

    if (
      req.user.role === "staff" &&
      (!complaint.assignedTo ||
        complaint.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Access denied to this complaint" });
    }

    res.json(complaint);
  } catch (error) {
    console.error("Get complaint by ID error:", error);
    res.status(500).json({ message: "Server error fetching complaint" });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Allow student to edit only if pending
    if (req.user.role === "student") {
      if (complaint.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (complaint.status !== "Pending") {
        return res.status(400).json({
          message: "Cannot edit complaint after it has been reviewed or assigned",
        });
      }

      complaint.title = req.body.title || complaint.title;
      complaint.description = req.body.description || complaint.description;
      complaint.category = req.body.category || complaint.category;
      complaint.location = req.body.location || complaint.location;
      complaint.priority = req.body.priority || complaint.priority;

      const updated = await complaint.save();
      return res.json(updated);
    }

    // Admin can update general fields
    if (req.user.role === "admin") {
      if (req.body.adminNote !== undefined) complaint.adminNote = req.body.adminNote;
      if (req.body.priority) complaint.priority = req.body.priority;
      if (req.body.status) complaint.status = req.body.status;
      if (req.body.assignedTo !== undefined) complaint.assignedTo = req.body.assignedTo;

      const updated = await complaint.save();
      return res.json(updated);
    }

    res.status(403).json({ message: "Not authorized to update this complaint" });
  } catch (error) {
    console.error("Update complaint error:", error);
    res.status(500).json({ message: "Server error updating complaint" });
  }
};

// @desc    Cancel (delete) complaint - Student can only cancel if Pending
// @route   DELETE /api/complaints/:id
// @access  Private (Student)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check ownership
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this complaint" });
    }

    // Check status: Only Pending can be cancelled
    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "You can only cancel complaints that are still Pending.",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint cancelled successfully" });
  } catch (error) {
    console.error("Delete complaint error:", error);
    res.status(500).json({ message: "Server error deleting complaint" });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
