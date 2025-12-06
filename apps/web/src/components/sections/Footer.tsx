import React from "react";
import useCurrentUser from "@/lib/useCurrentUser";
import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaRocket,
  FaCode,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";

export function Footer() {
  const user = useCurrentUser();
  const navItems = [
    { name: "About", link: "/#about", icon: <FaUsers className="h-4 w-4" /> },
    { name: "Blog & Facts", link: "/blogs", icon: <FaCode className="h-4 w-4" /> },
    { name: "RoadMaps", link: "/explore", icon: <FaRocket className="h-4 w-4" /> },
    { name: "Contact", link: "/#contact", icon: <FaGlobe className="h-4 w-4" /> },
  ];

  const features = [
    { name: "AI Interviews", icon: <FaRocket className="h-4 w-4" />, color: "text-blue-400" },
    { name: "Career Roadmaps", icon: <FaCode className="h-4 w-4" />, color: "text-purple-400" },
    { name: "Certification", icon: <FaShieldAlt className="h-4 w-4" />, color: "text-green-400" },
    { name: "Premium Support", icon: <FaStar className="h-4 w-4" />, color: "text-yellow-400" },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ayush-tiwari-84a823281/",
      icon: <FaLinkedin className="h-5 w-5" />,
      color: "hover:from-blue-600 hover:to-blue-400",
      bgColor: "from-blue-500/20 to-blue-600/20"
    },
    {
      name: "Instagram", 
      href: "https://www.instagram.com/quants_programmer?igsh=bzNiejJmMnRrZnpv",
      icon: <FaInstagram className="h-5 w-5" />,
      color: "hover:from-pink-600 hover:to-purple-400",
      bgColor: "from-pink-500/20 to-purple-500/20"
    },
    {
      name: "GitHub",
      href: "https://github.com/Ayush5071", 
      icon: <FaGithub className="h-5 w-5" />,
      color: "hover:from-gray-600 hover:to-gray-400",
      bgColor: "from-gray-500/20 to-gray-600/20"
    }
  ];

  const techIcons = [
    { icon: <FaHtml5 className="h-6 w-6" />, color: "text-orange-500", name: "HTML5", bgColor: "from-orange-500/20 to-orange-600/20" },
    { icon: <FaCss3Alt className="h-6 w-6" />, color: "text-blue-500", name: "CSS3", bgColor: "from-blue-500/20 to-blue-600/20" },
    { icon: <FaJs className="h-6 w-6" />, color: "text-yellow-400", name: "JavaScript", bgColor: "from-yellow-400/20 to-yellow-500/20" },
    { icon: <FaReact className="h-6 w-6" />, color: "text-cyan-400", name: "React", bgColor: "from-cyan-400/20 to-cyan-500/20" },
    { icon: <FaNodeJs className="h-6 w-6" />, color: "text-green-500", name: "Node.js", bgColor: "from-green-500/20 to-green-600/20" },
  ];



  return (
    <footer className="w-full relative overflow-hidden pb-10">
      {/* Enhanced Background Effects - Updated for new theme */}
      <div className="absolute inset-0 bg-[#0a0a0f]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 px-4 md:px-8">
        {/* Hero Section with Main CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12 text-center"
        >
          {/* Main Heading - Keeping original text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold max-w-6xl mx-auto leading-[0.95] mb-4 sm:mb-6 px-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Master the art of
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400">
                DEVELOPMENT
              </span>
            </h1>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-white/10"
            />
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 backdrop-blur-xl rounded-full border border-white/10"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4"
          >
            Join thousands of developers mastering their craft with AI-powered interviews, personalized roadmaps, and industry insights.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl font-semibold text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 text-sm sm:text-base"
                onClick={() => {
                  if (user) {
                    window.location.href = '/explore';
                  } else {
                    window.location.href = '/auth/signup';
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  Start Your Journey
                  <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              
              {/* Buy Me Coffee Button */}
              <motion.a
                href="https://www.buymeacoffee.com/quantsprogrammer"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl font-semibold text-white shadow-2xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  ☕ Buy me coffee
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </div>
          </motion.div>

          {/* Tech Stack Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-4">
              <span className="text-gray-400">Built with</span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {techIcons.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                    whileHover={{ scale: 1.2, y: -8, rotateY: 360 }}
                    className={`relative p-2 sm:p-3 bg-gradient-to-br ${tech.bgColor} backdrop-blur-xl border border-white/20 rounded-xl hover:border-white/40 transition-all duration-300 cursor-pointer group`}
                    title={tech.name}
                  >
                    <div className={`${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                      {tech.icon}
                    </div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
                  </motion.div>
                ))}
              </div>
            </h3>
          </motion.div>
        </motion.div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pb-8 sm:pb-10 md:pb-12 px-2 sm:px-4">
          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all duration-300 group"
          >
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <FaRocket className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
              </div>
              Quick Links
            </h3>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 8 }}
                >
                  <a
                    href={item.link}
                    className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-all duration-300 font-medium hover:bg-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl group/link text-sm sm:text-base"
                  >
                    <div className="text-blue-400 group-hover/link:text-purple-400 transition-colors duration-300">
                      {item.icon}
                    </div>
                    {item.name}
                    <FaArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300 ml-auto" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all duration-300"
          >
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <FaStar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              </div>
              Features
            </h3>
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className={`${feature.color} text-sm sm:text-base`}>
                    {feature.icon}
                  </div>
                  <span className="text-gray-300 font-medium text-sm sm:text-base">{feature.name}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg border border-green-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-green-300 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">All Systems Operational</span>
              </div>
            </div>
          </motion.div>

          {/* Platform Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all duration-300"
          >
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-lg">
                <FaCode className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400" />
              </div>
              Dev Roadmap
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 text-xs sm:text-sm">
              Your complete developer journey platform with AI-powered interviews, personalized roadmaps, and career guidance.
            </p>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <FaShieldAlt className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaGlobe className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-400" />
                <span>Global Community</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FaHeart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-400" />
                <span>Developer First</span>
              </div>
            </div>
          </motion.div>

          {/* Social Connect */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all duration-300"
          >
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                <FaUsers className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
              </div>
              Connect
            </h3>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r ${social.bgColor} backdrop-blur-lg border border-white/20 rounded-xl text-white hover:border-white/40 transition-all duration-300 group text-sm sm:text-base`}
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </div>
                  <span className="font-medium">{social.name}</span>
                  <FaArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-auto" />
                </motion.a>
              ))}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Join our community for the latest updates, tips, and career opportunities.
            </p>
          </motion.div>
        </div>

        {/* Enhanced Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative"
        >
          {/* Glowing Border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 md:px-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl mt-4 sm:mt-6 mx-2 sm:mx-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6 text-gray-400 text-xs sm:text-sm">
                <div className="text-center md:text-left">
                  &copy; {new Date().getFullYear()}{" "}
                  <a
                    href="https://ayush-delta.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold hover:underline"
                  >
                    Ayush Tiwari
                  </a>
                  {" "}X{" "}
                  <span className="text-purple-400 font-semibold">PrepSutra</span>
                  . All Rights Reserved.
                </div>
                <div className="h-1 w-1 bg-gray-600 rounded-full hidden md:block"></div>
                <div className="text-gray-500 text-center md:text-left">
                  Privacy Policy • Terms of Service
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm">
                  <span>Crafted with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-red-400"
                  >
                    <FaHeart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                  <span>for developers worldwide</span>
                </div>
                <div className="h-3 sm:h-4 w-px bg-gray-600"></div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-xs text-green-300 border border-green-500/30">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
