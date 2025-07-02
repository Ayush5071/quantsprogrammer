import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/explore", label: "Explore", icon: "🗺️" },
  { href: "/blogs", label: "Blogs", icon: "📝" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/top-interviews", label: "Top Interviews", icon: "⭐" },
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }
      
      // Change navbar appearance when scrolled
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-xl bg-black/80 border-b border-white/20 shadow-2xl shadow-black/20' 
          : 'backdrop-blur-lg bg-black/40 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Enhanced Logo with glassmorphism */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-60 group-hover:opacity-80 animate-pulse"></div>
              {/* Main logo container */}
              <div className="relative bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-lg p-2.5 rounded-xl border border-white/20 group-hover:border-white/40 transition-all duration-300">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                Dev Roadmap
              </span>
              <span className="text-xs text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors duration-300">Build • Learn • Grow</span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group relative px-4 py-2.5 text-zinc-300 hover:text-white font-medium transition-all duration-300 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                    {link.label}
                  </span>
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  {/* Glassmorphism glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              </motion.div>
            ))}
            
            {/* Enhanced CTA Buttons */}
            <div className="flex items-center gap-3 ml-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Link
                  href="/profile#interview-history"
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-lg hover:from-blue-500/90 hover:to-blue-600/90 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105"
                >
                  <span className="relative z-10">Past Interviews</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Link
                  href="/top-interview-history"
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-lg hover:from-purple-500/90 hover:to-purple-600/90 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/top-interview-history");
                  }}
                >
                  <span className="relative z-10">Top History</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-xl backdrop-blur-lg border text-zinc-300 hover:text-white transition-all duration-300 ${
                isMenuOpen 
                  ? 'bg-white/20 border-white/30' 
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
              }`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <motion.svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden mt-3 pb-4"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 p-4 mx-2 shadow-2xl shadow-black/20">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group border border-transparent hover:border-white/20"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                        <motion.div
                          className="ml-auto opacity-0 group-hover:opacity-100"
                          whileHover={{ x: 5 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-4 mt-4 border-t border-white/20 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <Link
                      href="/profile#interview-history"
                      className="block px-4 py-3.5 bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-lg text-white rounded-xl font-semibold text-center shadow-lg shadow-blue-500/25 border border-blue-500/30 hover:from-blue-500/90 hover:to-blue-600/90 hover:shadow-blue-500/40 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Past Interviews
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <Link
                      href="/top-interview-history"
                      className="block px-4 py-3.5 bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-lg text-white rounded-xl font-semibold text-center shadow-lg shadow-purple-500/25 border border-purple-500/30 hover:from-purple-500/90 hover:to-purple-600/90 hover:shadow-purple-500/40 transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        router.push("/top-interview-history");
                      }}
                    >
                      Top Interview History
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
