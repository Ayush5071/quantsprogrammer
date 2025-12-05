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
    googleId: {
        type: String,
        sparse: true,
    },
    authProvider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials",
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
    completedRoadmaps: [
        {
            roadmapId: { type: String, required: true },
            completedTasks: [String], // task IDs or titles
            completedAssignments: [String], // assignment IDs or titles
        }
    ],
    sampleTestAttempt: {
        completed: { type: Boolean, default: false },
        score: { type: Number },
        totalMarks: { type: Number },
        percentage: { type: Number },
        passed: { type: Boolean },
        certificateId: { type: String },
        completedAt: { type: Date },
        answers: [{ 
            questionId: String,
            question: String,
            userAnswer: Number,
            correctAnswer: Number,
            isCorrect: Boolean,
            marks: Number
        }]
    },
    fullName: { type: String },
    address: { type: String },
    age: { type: String },
    college: { type: String },
    gender: { type: String },
    contactNumber: { type: String },
    savedQuestions: { type: [String], default: [] },
    // Purchases
    purchases: {
        oaQuestions: {
            purchased: { type: Boolean, default: false },
            purchasedAt: { type: Date },
            paymentId: { type: String },
            paymentRequestId: { type: String },
            amount: { type: Number },
        }
    },
});

if (mongoose.models.users) {
    delete mongoose.models.users;
}

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
