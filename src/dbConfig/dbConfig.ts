import mongoose from "mongoose";

export async function connect() {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in environment variables.");
        }

        console.log(`${process.env.MONGO_URL} -> Connecting to MongoDB`);
        
        // Use `await` to handle async operations properly and enable error catching.
        await mongoose.connect(process.env.MONGO_URL);

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MONGODB CONNECTED");
        });

        connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            // Avoid exiting the process for better debugging during development
            // process.exit(); 
        });

    } catch (error) {
        console.error("Something went wrong while connecting to MongoDB:", error);
        throw error; // Re-throw the error for further handling by the caller
    }
}
