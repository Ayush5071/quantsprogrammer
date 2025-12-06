// User types
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  googleId?: string;
  phone?: string;
  linkedinUrl?: string;
  isPurchased: boolean;
  totalSolved: number;
  totalSolvedPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog types
export interface IBlog {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  coverImage?: string;
  isApproved: boolean;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

// Interview types
export interface IInterview {
  _id: string;
  company: string;
  role: string;
  questions: IQuestion[];
  difficulty: "easy" | "medium" | "hard";
  frequency: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  _id: string;
  question: string;
  answer?: string;
  type: string;
}

// Roadmap types
export interface IRoadmap {
  _id: string;
  title: string;
  description: string;
  topics: ITopic[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic {
  _id: string;
  title: string;
  content: string;
  order: number;
}

// Top Interview types
export interface ITopInterview {
  _id: string;
  title: string;
  company: string;
  role: string;
  questions: ITopInterviewQuestion[];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopInterviewQuestion {
  _id: string;
  question: string;
  expectedAnswer: string;
  points: number;
}

export interface ITopInterviewAttempt {
  _id: string;
  userId: string;
  interviewId: string;
  answers: IAttemptAnswer[];
  score: number;
  feedback: string;
  createdAt: Date;
}

export interface IAttemptAnswer {
  questionId: string;
  answer: string;
  score: number;
}
