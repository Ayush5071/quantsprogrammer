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
    <div className="relative h-72 w-full max-w-xs md:max-w-md flex flex-col p-4 sm:p-6 bg-zinc-900 rounded-3xl shadow-xl border-2 border-blue-800 hover:border-blue-400 transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold font-bebas text-blue-200 mb-2 line-clamp-2 break-words tracking-wide">
            {heading}
          </p>
          <p className="text-neutral-300 font-Sfpro text-xs sm:text-sm md:text-base line-clamp-3 break-words opacity-90 mb-4">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2 sm:gap-0">
          <div className="text-xs md:text-sm text-zinc-400 flex items-center gap-2">
            <span>Curated by</span>
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold break-all"
            >
              {author}
            </a>
          </div>
          <a
            href={link}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-800 hover:bg-blue-600 text-white font-bold rounded-xl shadow hover:scale-105 transition-transform border border-blue-900 text-xs sm:text-sm"
          >
            Explore
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-blue-900 opacity-20"></div>
    </div>
  );
}
