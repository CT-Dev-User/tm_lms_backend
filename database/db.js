import mongoose from "mongoose";

// Debug: Print all environment variables (remove in production)
console.log("Environment variables:", Object.keys(process.env));
console.log("DB variable value:", process.env.DB);

export const conn = async () => {
  try {
    if (!process.env.DB) {
      throw new Error("DB environment variable is undefined");
    }
    
    console.log("Connecting to DB:", process.env.DB);
    await mongoose.connect(process.env.DB);
    console.log("Database connection successful");
  } catch (error) {
    console.log("DB Connection Error:", error);
    throw error; // Re-throw so the calling code knows the connection failed
  }
};
