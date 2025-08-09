import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path resolution - go up one level from config to server
const envPath = path.join(__dirname, "..", ".env");

const envConfig = dotenv.config({
  path: envPath,
  debug: true,
});

if (envConfig.error) {
  console.error("❌ Error loading .env file:", envConfig.error);
  process.exit(1);
}

const DB_USERNAME = process.env.DB_USERNAME || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "";

// Validate that required environment variables are set
if (!DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
  console.error(
    "❌ Missing required database configuration in environment variables"
  );
  process.exit(1);
}

const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@webcluster.eakraf3.mongodb.net/?retryWrites=true&w=majority&appName=webCluster`;

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    if (error instanceof Error) {
      if (error.message.includes("bad auth")) {
        console.error("🔐 Authentication failed. Please verify:");
        console.error("1. Username/password are correct");
        console.error("2. User has Atlas privileges");
      }
    }

    process.exit(1);
  }
}

// Rest of your existing code remains the same
