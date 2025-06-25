import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/blogs", label: "Blogs" },
  { href: "/profile", label: "Profile" },
  { href: "/interview", label: "Mock Interview" },
];

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-950 border-b-2 border-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400">
          <img src="/official_logo.png" alt="Dev Roadmap" className="h-10 w-10 rounded-full" />
          Dev Roadmap
        </Link>
        <div className="flex gap-4 md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-200 hover:text-blue-400 font-medium text-lg transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/profile#interview-history"
            className="ml-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow transition-all"
          >
            Past Interviews
          </Link>
        </div>
      </div>
    </nav>
  );
}
