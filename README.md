<p align="center">
  <img src="public/official_logo.png" alt="PrepSutra Logo" width="120" height="120" />
</p>

<h1 align="center">🚀 PrepSutra</h1>

<p align="center">
  <strong>Your Ultimate Technical Interview Preparation Platform</strong>
</p>

<p align="center">
  <a href="https://www.prepsutra.tech">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#installation">Installation</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</p>

---

## 💡 Motivation

> **"Preparation is the key to success."** – Alexander Graham Bell

In today's competitive tech landscape, cracking interviews at top companies requires more than just coding skills—it demands structured preparation, real-world practice, and data-driven insights.

**PrepSutra** was born from a simple observation: thousands of developers struggle to find a unified platform that combines:
- 📊 **Company-specific question banks** with frequency data
- 🎯 **AI-powered mock interviews** for realistic practice
- 🗺️ **Curated learning roadmaps** for different tech domains
- 📜 **Certification programs** to validate skills
- 💰 **Placement data & compensation insights** for informed decisions

We're building the platform we wished existed during our own interview preparation journey.

---

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **Company-wise DSA Questions** | 450+ companies' LeetCode problems with frequency & acceptance data |
| **AI Mock Interviews** | Practice with AI interviewer using voice/text with real-time feedback |
| **Top Interviews** | Curated interview rounds with leaderboard rankings |
| **Learning Roadmaps** | Step-by-step guides for Web Dev, ML, DSA, and more |
| **Technical Blogs** | Community-driven blogs with likes & comments |
| **Certifications** | Earn verifiable certificates on roadmap completion |
| **Placement Data** | Real compensation data from top tech companies |

### 🔐 Authentication & Security
- Google OAuth 2.0 integration
- JWT-based session management
- Email verification with OTP
- Secure password reset flow

### 💳 Payments
- Instamojo payment gateway integration
- One-time purchase for premium content
- Webhook-based payment verification

---

## 🛠️ Tech Stack

### Frontend
```
Next.js 14        → App Router, Server Components, SSR
TypeScript        → Type-safe development
Tailwind CSS      → Utility-first styling
Framer Motion     → Smooth animations
GSAP              → Advanced scroll animations
Lucide Icons      → Modern icon library
```

### Backend
```
Next.js API Routes → Serverless API endpoints
MongoDB + Mongoose → Database & ODM
NextAuth.js        → Authentication
JWT                → Token-based auth
Nodemailer         → Email service
```

### Integrations
```
Google OAuth       → Social login
Instamojo          → Payment processing
Cloudinary         → Image uploads
Vercel Analytics   → Performance monitoring
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/signup` | Register new user |
| `POST` | `/api/users/login` | User login |
| `POST` | `/api/users/logout` | User logout |
| `GET` | `/api/users/me` | Get current user |
| `POST` | `/api/users/verifyemail` | Verify email OTP |
| `POST` | `/api/users/resendverification` | Resend verification email |
| `POST` | `/api/users/password/send` | Send password reset email |
| `POST` | `/api/users/password/reset` | Reset password |
| `GET` | `/api/auth/[...nextauth]` | NextAuth OAuth handlers |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/profile` | Get user profile |
| `PUT` | `/api/users/updateprofile` | Update profile |
| `GET` | `/api/users/[id]` | Get user by ID |

### Blogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blogs` | List all blogs |
| `POST` | `/api/blogs` | Create new blog |
| `GET` | `/api/blogs/[id]` | Get blog by ID |
| `PUT` | `/api/blogs/edit` | Edit blog |
| `POST` | `/api/blogs/like` | Toggle like on blog |
| `GET` | `/api/blogs/comments` | Get blog comments |
| `POST` | `/api/blogs/comments` | Add comment |
| `DELETE` | `/api/blogs/comments` | Delete comment |
| `POST` | `/api/blogs/request` | Request blog approval |

### Company Problems (Premium)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/company-problems` | List companies / Get problems |
| `GET` | `/api/company-problems?company=Google` | Get company-specific problems |

### AI Interview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/interview/ask` | Send message to AI interviewer |
| `POST` | `/api/interview/feedback` | Get interview feedback |
| `POST` | `/api/interview/feedback-voice` | Voice-based feedback |
| `GET` | `/api/interview/history` | Get interview history |

### Top Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/top-interviews` | List all top interviews |
| `POST` | `/api/top-interviews` | Create interview (Admin) |
| `POST` | `/api/top-interviews/generate-questions` | AI generate questions |
| `POST` | `/api/top-interviews/attempt` | Submit attempt |
| `GET` | `/api/top-interviews/attempts` | Get user attempts |
| `GET` | `/api/top-interviews/feedback` | Get attempt feedback |

### Roadmaps

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/roadmap/fetchall` | List all roadmaps |
| `GET` | `/api/roadmap/fetch?id=xxx` | Get roadmap by ID |
| `POST` | `/api/roadmap/create` | Create roadmap (Admin) |
| `POST` | `/api/roadmap/store` | Store roadmap data |
| `GET` | `/api/roadmap/progress` | Get user progress |
| `PUT` | `/api/roadmap/[id]` | Update roadmap |

### Certification

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/certification` | Get user certificates |
| `POST` | `/api/certification` | Generate certificate |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/create-request` | Create payment request |
| `GET` | `/api/payment/oa-questions` | Check purchase status |
| `GET` | `/api/payment/verify` | Verify payment |
| `POST` | `/api/payment/webhook` | Instamojo webhook |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/admin-panel` | Admin dashboard data |
| `POST` | `/api/admin/unlock-oa` | Unlock OA for user |

---

## 📁 Project Structure (Turborepo Monorepo)

```
prepsutra/
├── apps/
│   └── web/                   # Main Next.js application
│       ├── public/            # Static assets
│       ├── src/
│       │   ├── app/           # Next.js App Router
│       │   │   ├── api/       # API routes
│       │   │   ├── auth/      # Auth pages
│       │   │   ├── blogs/     # Blog pages
│       │   │   └── ...        # Other pages
│       │   ├── components/    # UI components
│       │   ├── lib/           # Utilities & hooks
│       │   └── helpers/       # Helper functions
│       ├── package.json
│       ├── next.config.mjs
│       └── tsconfig.json
├── packages/
│   ├── database/              # Shared MongoDB models
│   │   └── src/
│   │       ├── config.ts      # DB connection
│   │       ├── models/        # Mongoose schemas
│   │       └── index.ts       # Exports
│   ├── types/                 # Shared TypeScript types
│   │   └── src/index.ts
│   ├── ui/                    # Shared UI components
│   │   └── src/index.tsx
│   ├── tsconfig/              # Shared TS configs
│   │   ├── base.json
│   │   └── nextjs.json
│   └── eslint-config/         # Shared ESLint configs
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # pnpm workspace config
└── package.json               # Root package.json
```

---

## ⚡ Installation

### Prerequisites
- Node.js 18+
- pnpm 9.0+
- MongoDB Atlas account
- Google OAuth credentials
- Instamojo API keys (for payments)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Ayush5071/quantsprogrammer.git
cd quantsprogrammer
```

2. **Install pnpm (if not installed)**
```bash
npm install -g pnpm
```

3. **Install dependencies**
```bash
pnpm install
```

4. **Configure environment variables**
```bash
cp .env.example .env.local
```

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# JWT
JWT_SECRET=your-jwt-secret
TOKEN_SECRET=your-token-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email
SMTP_PASS=your-app-password

# Payments (Instamojo)
INSTAMOJO_API_KEY=xxx
INSTAMOJO_AUTH_TOKEN=xxx
INSTAMOJO_SALT=xxx

# Domain
DOMAIN=http://localhost:3000
```

5. **Run development server**
```bash
pnpm dev
```

6. **Build for production**
```bash
pnpm build
```

7. **Open browser**
```
http://localhost:3000
```

---

## 📦 Workspace Packages

| Package | Description |
|---------|-------------|
| `apps/web` | Main Next.js application |
| `@prepsutra/database` | Shared MongoDB models & connection |
| `@prepsutra/types` | Shared TypeScript type definitions |
| `@prepsutra/ui` | Shared UI components |
| `@prepsutra/tsconfig` | Shared TypeScript configurations |
| `@prepsutra/eslint-config` | Shared ESLint configurations |

### Adding a New App

```bash
cd apps
mkdir my-new-app
# Set up your new app with its own package.json
```

### Using Shared Packages

```typescript
// Import from shared database package
import { connect, User, Blog } from "@prepsutra/database";

// Import from shared types package
import { IUser, IBlog } from "@prepsutra/types";
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `apps/web`
4. Add environment variables
5. Deploy!

Vercel automatically detects Turborepo and builds the appropriate app.

```bash
vercel --prod
```

---

## 📊 Database Models

| Model | Description |
|-------|-------------|
| `User` | User accounts, auth, purchase status |
| `Blog` | Blog posts with likes & comments |
| `BlogRequest` | Pending blog approvals |
| `Roadmap` | Learning roadmaps & topics |
| `RoadmapTest` | Roadmap quiz questions |
| `Interview` | AI interview sessions |
| `TopInterview` | Curated interview challenges |
| `TopInterviewAttempt` | User attempt records |
| `Certification` | User certificates |

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Author

<p align="center">
  <img src="https://avatars.githubusercontent.com/Ayush5071" width="100" height="100" style="border-radius: 50%;" alt="Ayush Tiwari" />
</p>

<p align="center">
  <strong>Ayush Tiwari</strong><br/>
  2nd Year Undergrad @ MNNIT Allahabad
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/ayush-tiwari-84a823281/">LinkedIn</a> •
  <a href="https://github.com/Ayush5071">GitHub</a> •
  <a href="https://ayush-delta.vercel.app">Portfolio</a>
</p>

---

<p align="center">
  Made with ❤️ for developers worldwide
</p>

<p align="center">
  <a href="https://www.prepsutra.tech">
    <img src="https://img.shields.io/badge/Visit-PrepSutra-blue?style=for-the-badge" alt="Visit PrepSutra" />
  </a>
</p>
