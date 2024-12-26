import { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { CheckedDataProvider } from "@/context/checkedDataContext";
import { Toaster } from "react-hot-toast";
import { RoadmapProvider } from "@/context/RoadmapContext";

// Metadata for Quants Programmer
export const metadata: Metadata = {
  title: "Quants Programmer - Technical Roadmaps and Blogs",
  description:
    "Learn programming and grow your skills with technical roadmaps and blogs on Quants Programmer. Created by Ayush Tiwari, a second-year undergrad from MNNIT Allahabad.",
  keywords:
    "programming, roadmaps, blogs, web development, machine learning, data science, programming skills, learning resources",

  // Corrected authors to use objects in array
  authors: [
    {
      name: "Ayush Tiwari",
      url: "https://ayush-delta.vercel.app",
    },
  ],

  robots: "index, follow",

  // Open Graph Meta Tags
  openGraph: {
    title: "Quants Programmer - Technical Roadmaps and Blogs",
    description:
      "Quants Programmer provides technical roadmaps and blogs to help you grow your skills in development, machine learning, data science, and more.",
    images: [
      {
        url: "/official_logo.png", // Replace with your actual logo URL
        width: 1200,
        height: 630,
        alt: "Quants Programmer Logo",
      },
    ],
    url: "https://yourwebsite.com",
    type: "website",
    siteName: "Quants Programmer",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

// Defining the viewport separately to comply with Next.js rules
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased notallow`}>
        <CheckedDataProvider>
          <RoadmapProvider>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          </RoadmapProvider>
        </CheckedDataProvider>
        <Analytics />
      </body>
    </html>
  );
}
