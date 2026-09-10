const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Complaint = require("./models/Complaint");

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is not defined in .env file.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    console.log("Cleared existing users and complaints.");

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("Admin@123", salt);
    const staffPassword = await bcrypt.hash("Staff@123", salt);
    const studentPassword = await bcrypt.hash("Student@123", salt);

    // Create Demo Users
    const admin = await User.create({
      name: "Campus Admin",
      email: "admin@campusfix.com",
      password: adminPassword,
      role: "admin",
    });

    const staff1 = await User.create({
      name: "Ramesh Sharma (Maintenance Staff)",
      email: "staff@campusfix.com",
      password: staffPassword,
      role: "staff",
    });

    const staff2 = await User.create({
      name: "Suresh Kumar (Electrical & IT Staff)",
      email: "staff2@campusfix.com",
      password: staffPassword,
      role: "staff",
    });

    const student = await User.create({
      name: "Rahul Verma (Student)",
      email: "student@campusfix.com",
      password: studentPassword,
      role: "student",
    });

    const student2 = await User.create({
      name: "Ananya Sharma (Student)",
      email: "ananya@campusfix.com",
      password: studentPassword,
      role: "student",
    });

    console.log("Created demo users:");
    console.log("- Admin:   admin@campusfix.com / Admin@123");
    console.log("- Staff:   staff@campusfix.com / Staff@123");
    console.log("- Student: student@campusfix.com / Student@123");

    // Create 8-10 Sample Complaints
    const complaints = [
      {
        title: "Ceiling fan making loud grinding noise",
        description:
          "The ceiling fan in the center of Classroom 302 makes an unbearable rattling noise and wobbles during lectures.",
        category: "Electrical",
        location: "Academic Block A, Classroom 302",
        priority: "High",
        status: "In Progress",
        student: student._id,
        assignedTo: staff2._id,
        adminNote: "Assigned to Suresh on priority before exams.",
      },
      {
        title: "Wi-Fi router offline on 3rd floor",
        description:
          "The Wi-Fi access point in Hostel 4, 3rd floor wing has been blinking red since yesterday morning. No internet connectivity.",
        category: "Internet/Wi-Fi",
        location: "Hostel 4, 3rd Floor Corridor",
        priority: "High",
        status: "Assigned",
        student: student._id,
        assignedTo: staff2._id,
        adminNote: "Check campus fiber switch & router power supply.",
      },
      {
        title: "Washroom basin pipe leakage",
        description:
          "Water is continuously dripping from the drain pipe under the middle sink, causing a puddle on the floor.",
        category: "Plumbing",
        location: "Library Building, 2nd Floor Men's Washroom",
        priority: "Medium",
        status: "Pending",
        student: student._id,
      },
      {
        title: "Broken wooden desk bench",
        description:
          "The wooden bench in Row 4 has loose screws and detached plank. Risk of someone falling.",
        category: "Furniture",
        location: "Lecture Hall Complex, Hall B",
        priority: "Low",
        status: "Pending",
        student: student._id,
      },
      {
        title: "Spill and dust cleanup needed in Science Block",
        description:
          "Chemical water spill near Chemistry Lab entrance needs immediate mop up to prevent slipping.",
        category: "Cleaning",
        location: "Science Block, 1st Floor East Wing",
        priority: "Medium",
        status: "Resolved",
        student: student._id,
        assignedTo: staff1._id,
        adminNote: "Housekeeping notified.",
        resolutionNote:
          "Floor washed, sanitised and dried by housekeeping team. Caution sign removed.",
      },
      {
        title: "Geyser not heating water",
        description:
          "The bathroom geyser in Room 210 switches on its LED light but does not produce any hot water.",
        category: "Hostel",
        location: "Hostel B, Room 210",
        priority: "High",
        status: "In Progress",
        student: student2._id,
        assignedTo: staff1._id,
        adminNote: "Checked by warden, heating coil needs replacement.",
      },
      {
        title: "Projector flickering during presentations",
        description:
          "Ceiling projector randomly turns off every 10 minutes. HDMI connector pin looks bent.",
        category: "Classroom",
        location: "Computer Lab 3, Ground Floor",
        priority: "Medium",
        status: "Assigned",
        student: student2._id,
        assignedTo: staff2._id,
      },
      {
        title: "Drinking water cooler tap leaking",
        description:
          "The left push-tap on the water cooler is stuck halfway open and continuously wasting water.",
        category: "Plumbing",
        location: "Central Library, Ground Floor",
        priority: "Low",
        status: "Resolved",
        student: student2._id,
        assignedTo: staff1._id,
        resolutionNote:
          "Replaced faulty brass push-tap with brand new valve. Leak completely sealed.",
      },
      {
        title: "Tube light flickering constantly",
        description:
          "Front-left tubelight keeps flashing like a strobe light, causing severe eye strain.",
        category: "Electrical",
        location: "Seminar Hall 1",
        priority: "Low",
        status: "Pending",
        student: student._id,
      },
    ];

    await Complaint.insertMany(complaints);
    console.log(`Inserted ${complaints.length} sample complaints successfully.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
