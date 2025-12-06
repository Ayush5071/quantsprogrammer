import { motion } from "framer-motion";

interface RoadmapCardProps {
  heading: string;
  description: string;
  link: string;
  author: string;
  linkedIn: string;
}

export function Roadmapcard({
  heading,
  description,
  link,
  author,
  linkedIn,
}: RoadmapCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 shadow-xl cursor-pointer h-80 flex flex-col"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300 line-clamp-2">
              {heading}
            </h3>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed group-hover:text-zinc-200 transition-colors duration-300 line-clamp-3">
              {description || "Start your learning journey with this comprehensive roadmap."}
            </p>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 mb-6 mt-auto">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0" />
          <span className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors duration-300">
            Curated by{" "}
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {author}
            </a>
          </span>
        </div>

        {/* Action Button */}
        <motion.a
          href={link}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          Explore Roadmap
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  );
}
