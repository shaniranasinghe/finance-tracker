import mongoose from "mongoose";

const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl); // Simplified connection
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

export default connectDB;
