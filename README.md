# 🚀 Dev Roadmap Platform

A modern, professional, and user-friendly platform for sharing, reading, and managing tech blogs, developer roadmaps, personal portfolios, and now AI-powered mock interviews.

---

## ✨ Features

- **AI-Powered Mock Interviews:**
  - Start a mock interview with dynamic, Gemini-generated questions based on your skills and experience.
  - Voice-based answering with live camera feed, speech-to-text, and AI feedback/scoring.
  - All interview attempts and feedback are saved to your profile.
  - View detailed feedback and scores for each attempt.
- **Top Interviews:**
  - Special admin-curated interviews with company/field/level context and hard questions.
  - Any user can attempt Top Interviews and receive strict AI feedback and a score.
  - Leaderboard for each Top Interview, showing all users ranked by score.
  - See number of questions on each Top Interview card.
- **Interview History:**
  - Users can view all their past interview attempts and feedback in their profile.
- **Dynamic Blog System**: Request blog access, admin approval, and role-based blog creation/editing.
- **Medium-like Blog Editor**: Rich text, images, formatting, and secure Cloudinary uploads.
- **Beautiful Blog Cards & Detail Pages**: Modern, responsive, and professional UI for both blog lists and individual articles.
- **Roadmap Explorer**: Browse, explore, and follow detailed developer roadmaps for various tech stacks and career paths.
- **Roadmap Creation (Admin)**: Admins can create multi-phase roadmaps with tasks and assignments, including links and resources.
- **Interactive Roadmap UI**: Users can track progress, mark tasks/assignments as complete, and view their progress visually.
- **Personal Portfolio/Profile**: Each user has a profile page with editable personal info, roadmap progress, and blog activity.
- **Notifications**: Real-time request/approval notifications for users and admins.
- **Profanity Filtering**: Automatic filtering of inappropriate content.
- **Admin Controls**: Approve/reject blog requests, delete any blog, and manage all content.
- **Image Uploads**: Secure backend image upload to Cloudinary with environment-based credentials.
- **Live Blog Preview**: See your blog as you write, including images and formatting.
- **Responsive & Accessible**: Works beautifully on all devices, with accessible design.
- **Modern Homepage Design**: Redesigned hero section with automatic carousel for mobile and improved card alignment.
- **FAQ Section**: Updated with gradient backgrounds, rounded corners, and hover effects.
- **User Testimonials Section**: Redesigned for better alignment, reduced padding, and clean appearance.

---

## 🏗️ Project Structure

```
Dev-Roadmap/
├── public/                # Static assets (images, fonts, etc.)
├── src/
│   ├── app/
│   │   ├── blogs/         # Blog pages (list, create, edit, detail)
│   │   ├── explore/       # Roadmap explorer UI
│   │   ├── profile/       # User profile/portfolio page
│   │   ├── api/           # API routes (blogs, users, upload, roadmap, etc.)
│   │   ├── admin/         # Admin panel (roadmap/blog management)
│   │   ├── auth/          # Auth pages (login, signup, etc.)
│   │   ├── interview/     # Mock interview pages (dashboard, feedback, etc.)
│   │   ├── top-interviews/# Top Interviews pages (list, attempt, leaderboard)
│   │   └── ...            # Other app routes
│   ├── components/        # UI components (BlogCard, Roadmapcard, RichTextEditor, etc.)
│   ├── models/            # Mongoose models (blog, user, roadmap, interview, topInterview, ...)
│   ├── dbConfig/          # Database connection config
│   ├── helpers/           # Utility/helper functions
│   └── ...                # More source files
├── .env                   # Environment variables
├── package.json           # Project metadata & dependencies
└── README.md              # This file
```

---

## 🚦 Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/dev-roadmap.git
   cd dev-roadmap
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your MongoDB, Cloudinary, and other secrets.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📝 Usage

- **Mock Interviews:**
  - Go to the Mock Interview section, start an interview, and answer questions by voice or text.
  - Get instant AI feedback and a score after submitting.
- **Top Interviews:**
  - Attempt admin-curated Top Interviews for specific companies/fields.
  - Compete on the leaderboard and see how you rank.
- **Read Blogs:** Anyone can browse and read all published blogs.
- **Request to Write:** Users can request blog writing access; admins approve/reject via notifications.
- **Create/Edit Blogs:** Approved users and admins can create and edit blogs with a rich text editor and image uploads.
- **Explore Roadmaps:** Browse curated developer roadmaps, view phases, tasks, and assignments, and track your progress.
- **Create Roadmaps (Admin):** Admins can create/edit/delete roadmaps with multiple phases, tasks, and assignments.
- **Profile/Portfolio:** Users can view and edit their profile, see roadmap progress, and manage their blog activity.
- **Admin Panel:** Admins can manage all blog/roadmap requests and delete any blog or roadmap.
- **Notifications:** See your request status or manage incoming requests as admin.
- **View History:** See all your past interview attempts and feedback in your profile.

---

## 🛡️ Security & Best Practices

- All image uploads go through a secure backend API.
- Profanity filter ensures clean content.
- Sensitive credentials are stored in `.env` and never exposed to the frontend.
- Only authorized users can create/edit blogs or roadmaps; only admins can delete any blog/roadmap.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, MongoDB, Mongoose
- **Editor:** React Quill (rich text)
- **Image Upload:** Cloudinary (via backend API)
- **Notifications:** Custom notification system
- **AI:** Google Gemini API for question generation and feedback
- **Other:** Axios, bad-words, react-hot-toast, GSAP, and more

---

## 📸 Screenshots

> _Add screenshots/gifs here to showcase the new interview and leaderboard features!_

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Credits

- Inspired by Medium, Hashnode, roadmap.sh, and the open-source community.
- Built with ❤️ by Ayush and contributors.

---

> _For questions, suggestions, or support, open an issue or contact the maintainer._
