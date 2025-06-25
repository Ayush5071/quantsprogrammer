# 🚀 Dev Roadmap Platform

A modern, professional, and user-friendly platform for sharing, reading, and managing tech blogs, developer roadmaps, personal portfolios, and now AI-powered mock interviews.

---

# 🌟 Project Aim & Vision

Dev Roadmap is designed to empower junior developers and students in their tech journey. Our mission is to provide a one-stop platform for:
- Navigating career roadmaps with clear, actionable steps.
- Practicing real-world interviews with AI-powered feedback (Gemini integration).
- Building a strong portfolio and sharing knowledge through blogs.
- Tracking progress, earning certificates, and connecting with a supportive community.

Whether you're preparing for your first job, switching stacks, or looking to upskill, Dev Roadmap is your companion for growth and success.

---

# 🛠️ Tech Stack & Libraries Used

- **Framework:** Next.js (App Router, SSR/SSG, API routes)
- **Frontend:** React, Tailwind CSS, GSAP (animations), Locomotive Scroll (smooth scroll), Ant Design (UI components)
- **Authentication:** JWT, custom email verification, password reset, secure sessions
- **Database:** MongoDB (Mongoose ODM)
- **AI Integration:** Gemini API (Google AI) for mock interviews and support
- **Image Uploads:** Cloudinary (secure uploads in blogs and profile)
- **Text-to-Speech/Speech-to-Text:** Web Speech API (TTS/STT in interviews)
- **Rich Text Editor:** Medium-like editor for blogs
- **Canvas:** Certificate generation
- **Other:**
  - Profanity filtering
  - Real-time notifications
  - Responsive, accessible design
  - Modern navigation (floating nav, dropdowns, hamburger menu)

---

# 🗂️ Project Structure

```
root/
├── public/                # Static assets (images, fonts, icons)
├── src/
│   ├── app/               # Next.js app directory (pages, API routes)
│   │   ├── auth/          # Auth pages (login, signup, etc.)
│   │   ├── blogs/         # Blog pages
│   │   ├── explore/       # Roadmap explorer
│   │   ├── profile/       # User profile & history
│   │   ├── top-interviews/# Top Interview pages
│   │   ├── api/           # API routes (users, blogs, interviews, etc.)
│   │   └── ...
│   ├── components/
│   │   ├── sections/      # Page sections (Hero, FAQ, Testimonials, etc.)
│   │   ├── ui/            # UI components (Navbar, cards, etc.)
│   │   └── ...
│   ├── context/           # React context providers
│   ├── data/              # Static data
│   ├── dbConfig/          # Database config
│   ├── helpers/           # Utility/helper functions
│   ├── lib/               # Custom hooks, libraries
│   ├── models/            # Mongoose models
│   └── ...
├── .env.example           # Environment variable template
├── package.json           # Project metadata & scripts
├── tailwind.config.ts     # Tailwind CSS config
├── README.md              # Project documentation
└── ...
```

---

# 🚦 Setup Guide

1. **Clone the repository and install dependencies:**
   ```sh
   git clone <repo-url>
   cd Dev-Roadmap
   npm install
   ```
2. **Set up your environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your MongoDB, Cloudinary, and Gemini API keys.
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Access the app:**
   - Visit `http://localhost:3000` in your browser.

---

# 🧑‍💻 How This Project Helps

- **Guided Learning:** Step-by-step roadmaps for various tech stacks and roles.
- **Real Interview Practice:** AI-powered mock and top interviews with instant feedback, TTS/STT, and leaderboard.
- **Portfolio Building:** Write and publish blogs (with admin approval), showcase your progress, and earn certificates.
- **Community & Support:** Connect with peers, get feedback, and access support via the Contact Support page.
- **Admin Tools:** Manage users, content, and roadmaps with ease.
- **Modern Experience:** Fast, smooth, and accessible UI for all devices.

---

# 🆕 Recent Features (2025)

- Modernized all authentication pages with glassmorphism, gradients, accessibility, and robust validation.
- Unified error/success messaging and improved accessibility across user-facing pages.
- Improved performance by removing heavy backgrounds and optimizing gradients.
- Created a Contact Support page with Gemini AI integration and robust error handling.
- Redesigned profile feedback section: horizontally scrollable cards, modal popup for details, and mobile-friendly scroll.
- Overhauled Top Interview attempt flow: answers always saved, clear button added, attempts posted to DB for leaderboard.
- Leaderboard now shows only each user's highest score.
- Added fixed back button to all major pages (hidden on mobile).
- Enhanced TTS (text-to-speech) experience: stops on navigation, toggle button for user control.
- Created /top-interview-history page to display all top interview attempts for the current user.
- Improved Top Interview History cards and modal visuals.
- Updated all navbars (desktop, mobile, floating) to include both Top Interviews and Top Interview History.
- Added dropdown menu for Interview in homepage floating navbar.
- Fixed hamburger menu: closes on toggle, menu item click, or overlay click; restored alignment and dropdown position.
- Fixed runtime error in homepage navbar by supporting dropdown navItems and preventing undefined hrefs.
- Hid scrollbars globally for all pages for a cleaner look.
- Admins can create and update any roadmap, including adding tasks, assignments, and resource links to any phase or section.
- Roadmap progress and task completion are stored per user, with visual progress tracking.
- Full authentication system: registration, login, email verification, password reset/change, and secure JWT-based sessions.
- Blog system: any user can request blog access; after admin approval, users can write and publish blogs.
- Interview section: two types—Mock Interview (AI-powered, anyone can create/attempt) and Top Interview (admin-created, leaderboard, open to all).
- After completing any roadmap, users receive a certificate generated by canvas.
- Profile section: stores roadmap progress, interview attempts, feedback, and allows easy profile updates.
- Interview History and Feedback: dedicated pages for all attempts, with TTS/STT features for a real interview feel.
- Organized admin page: view all users, data, and access admin-specific features.

---

## ✨ Features

- **Admin Roadmap Management:**
  - Admins can create, update, and manage any roadmap, including adding tasks, assignments, and resource links to any section or phase.
  - Roadmap progress and task completion are tracked and stored for each user.
- **Authentication & User Management:**
  - Complete auth flow: register, login, email verification, password reset/change, and secure sessions.
  - Profile section with editable info, roadmap progress, interview details, and feedback.
- **Blog System:**
  - Any user can request blog access; after admin approval, users can write and publish blogs.
  - Medium-like blog editor with rich text, images, and secure uploads.
  - Admins can approve/reject blog requests and manage all content.
- **Interview Section:**
  - Two types: Mock Interview (AI-powered, anyone can create/attempt) and Top Interview (admin-created, leaderboard, open to all).
  - Leaderboard for Top Interviews, showing user ranks and scores.
  - TTS (text-to-speech) and STT (speech-to-text) features for a real interview experience.
  - Interview feedback and history pages, with detailed feedback and modal popups.
- **Certificates:**
  - After completing any roadmap, users receive a certificate generated by canvas.
- **Admin Dashboard:**
  - Organized admin page to view all users, data, and access admin-specific features.
- **Modern UI/UX:**
  - Smooth, responsive, and accessible design throughout the platform.
  - FAQ and Testimonials sections for user support and trust.
  - Floating navbars, dropdown menus, and mobile-friendly navigation.
- **Other Features:**
  - Real-time notifications, profanity filtering, secure image uploads, and live blog preview.

---

# Getting Started

1. Clone the repository and install dependencies:
   ```sh
   git clone <repo-url>
   cd Dev-Roadmap
   npm install
   ```
2. Set up your environment variables (see `.env.example`).
3. Run the development server:
   ```sh
   npm run dev
   ```

---

# Contributing

We welcome contributions! Please open an issue or submit a pull request for any improvements or bug fixes.

---

# Contact & Support

For support, use the Contact Support page or reach out via email listed in the repository.

---
