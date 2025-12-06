import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
    // If already connected, skip
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in environment variables.");
        }

        // Set max listeners to avoid warning
        mongoose.connection.setMaxListeners(20);
        
        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log("MONGODB CONNECTED");

    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
