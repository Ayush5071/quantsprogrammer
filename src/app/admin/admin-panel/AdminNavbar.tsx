import React, { useState } from "react";
import { useRouter } from "next/navigation";

const adminLinks = [
  { label: "Dashboard", href: "/admin/admin-panel" },
  { label: "Create Roadmap", href: "/admin/admin-panel/roadmap-create" },
  { label: "Manage Roadmaps", href: "/admin/admin-panel/roadmaps" },
  { label: "Blog Requests", href: "/admin/admin-panel/blog-requests" },
  { label: "Manage Blogs", href: "/admin/admin-panel/blogs" },
  { label: "User Management", href: "/admin/admin-panel/users" },
  // Add more as needed
];

const AdminNavbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-bold text-white tracking-wide cursor-pointer" onClick={() => router.push("/admin/admin-panel")}>Admin Panel</div>
      <div className="hidden md:flex gap-6">
        {adminLinks.map(link => (
          <button
            key={link.href}
            className="text-white hover:text-blue-300 font-semibold transition-colors"
            onClick={() => router.push(link.href)}
          >
            {link.label}
          </button>
        ))}
      </div>
      {/* Mobile menu */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setOpen(!open)} className="text-white focus:outline-none">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {open && (
          <div className="absolute top-16 right-6 bg-zinc-900 rounded-xl shadow-lg py-4 px-6 flex flex-col gap-4 z-50 border border-blue-800 animate-fade-in">
            {adminLinks.map(link => (
              <button
                key={link.href}
                className="text-white hover:text-blue-300 font-semibold text-lg text-left"
                onClick={() => { setOpen(false); router.push(link.href); }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
