import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to database: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
};
