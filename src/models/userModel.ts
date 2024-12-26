import mongoose, { Schema } from "mongoose";

// Define the schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    checkedData: {
        type: [String], // An array of strings
        default: [], // Default to an empty array
    },
});

// Avoid overwriting the model during hot reloading in development
if (mongoose.models.users) {
    delete mongoose.models.users;
}

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
