const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(
      "[CampusFix Notice] MongoDB Atlas connection string is required for database persistence."
    );
    console.warn(
      "Please update MONGO_URI in server/.env with your MongoDB Atlas cluster URI."
    );
  }
};

module.exports = connectDB;
