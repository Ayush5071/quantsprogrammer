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
        },
        resumeScreeningPremium: {
            purchased: { type: Boolean, default: false },
            purchasedAt: { type: Date },
            paymentId: { type: String },
            paymentRequestId: { type: String },
            amount: { type: Number },
        },
        mockInterviews: {
            purchased: { type: Boolean, default: false },
            purchasedAt: { type: Date },
            paymentId: { type: String },
            paymentRequestId: { type: String },
            amount: { type: Number },
        }
    },
    // Daily mock interview tracking
    mockInterviewUsage: {
        date: { type: String }, // YYYY-MM-DD format
        count: { type: Number, default: 0 },
    },
    // Profile photo
    profilePhoto: { type: String },
    // Bio
    bio: { type: String, maxlength: 500 },
    // Social links
    linkedIn: { type: String },
    twitter: { type: String },
    portfolio: { type: String },
    // Coding profiles
    codingProfiles: {
        github: {
            username: { type: String },
            connected: { type: Boolean, default: false },
            stats: {
                totalCommits: { type: Number, default: 0 },
                totalStars: { type: Number, default: 0 },
                publicRepos: { type: Number, default: 0 },
                followers: { type: Number, default: 0 },
            },
            lastUpdated: { type: Date },
        },
        leetcode: {
            username: { type: String },
            connected: { type: Boolean, default: false },
            stats: {
                totalSolved: { type: Number, default: 0 },
                easySolved: { type: Number, default: 0 },
                mediumSolved: { type: Number, default: 0 },
                hardSolved: { type: Number, default: 0 },
                ranking: { type: Number },
                contestRating: { type: Number },
            },
            lastUpdated: { type: Date },
        },
        codeforces: {
            username: { type: String },
            connected: { type: Boolean, default: false },
            stats: {
                rating: { type: Number, default: 0 },
                maxRating: { type: Number, default: 0 },
                rank: { type: String },
                problemsSolved: { type: Number, default: 0 },
                contestsParticipated: { type: Number, default: 0 },
            },
            lastUpdated: { type: Date },
        },
        codechef: {
            username: { type: String },
            connected: { type: Boolean, default: false },
            stats: {
                rating: { type: Number, default: 0 },
                stars: { type: Number, default: 0 },
                globalRank: { type: Number },
                problemsSolved: { type: Number, default: 0 },
            },
            lastUpdated: { type: Date },
        },
    },
    // Profile visibility
    isPublicProfile: { type: Boolean, default: true },
    profileSlug: { type: String, unique: true, sparse: true },
});

if (mongoose.models.users) {
    delete mongoose.models.users;
}

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
