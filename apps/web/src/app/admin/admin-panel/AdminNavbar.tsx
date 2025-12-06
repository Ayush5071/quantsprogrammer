
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTachometerAlt, FaMap, FaListAlt, FaBlog, FaUserShield, FaUsers, FaPenFancy, FaClipboardList } from "react-icons/fa";

const adminLinks = [
  { label: "Dashboard", href: "/admin/admin-panel", icon: <FaTachometerAlt /> },
  { label: "Create Roadmap", href: "/admin/admin-panel/roadmap-create", icon: <FaMap /> },
  { label: "Manage Roadmaps", href: "/admin/admin-panel/roadmaps", icon: <FaListAlt /> },
  { label: "Blog Requests", href: "/admin/blog-requests", icon: <FaPenFancy /> },
  { label: "Manage Blogs", href: "/admin/admin-panel/blogs", icon: <FaBlog /> },
  { label: "Top Interview Create", href: "/admin/top-interview-create", icon: <FaClipboardList /> },
  { label: "User Management", href: "/admin/admin-panel/users", icon: <FaUsers /> },
];

const AdminNavbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/10 backdrop-blur-xl border-b border-white/20 py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-wide cursor-pointer flex items-center gap-2" onClick={() => router.push("/admin/admin-panel")}> <FaUserShield className="text-blue-400" /> Admin Panel</div>
      <div className="hidden md:flex gap-4">
        {adminLinks.map(link => (
          <button
            key={link.href}
            className="flex items-center gap-2 text-white hover:text-blue-300 font-semibold text-lg px-4 py-2 rounded-xl transition-all bg-white/5 hover:bg-blue-900/40 border border-white/10 shadow"
            onClick={() => router.push(link.href)}
          >
            <span className="text-xl">{link.icon}</span> {link.label}
          </button>
        ))}
      </div>
      {/* Mobile menu */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setOpen(!open)} 
          className="text-white focus:outline-none"
          aria-label="Toggle mobile menu"
          title="Toggle mobile menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {open && (
          <div className="absolute top-16 right-6 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg py-4 px-6 flex flex-col gap-4 z-50 animate-fade-in">
            {adminLinks.map(link => (
              <button
                key={link.href}
                className="flex items-center gap-2 text-white hover:text-blue-300 font-semibold text-lg text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-blue-900/60 border border-white/10"
                onClick={() => { setOpen(false); router.push(link.href); }}
              >
                <span className="text-xl">{link.icon}</span> {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
