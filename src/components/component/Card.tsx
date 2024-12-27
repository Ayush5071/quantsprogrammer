import { CardSpotlight } from "../ui/CardSpotlight";

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
    <CardSpotlight className="h-64 w-96 flex flex-col  p-6">
      {/* Heading on top left */}
      <p className="text-2xl font-bold font-bebas relative text-zinc-100">{heading}</p>

      {/* Description with 'Curated by' section at the bottom left */}
      <div className="text-neutral-200 font-Sfpro relative flex-1 mt-4">
        <p>{description}</p>
      </div>

      {/* Curated by section */}
      <div className="text-neutral-300 font-sfText relative text-xs md:text-sm mt-4">
        Curated by{" "}
        <a
          href={linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {author}
        </a>
      </div>

      {/* Explore button positioned at bottom right */}
      <a
        href={link}
        className="absolute font-sfText bottom-4 right-4 flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 bg-neutral-800 text-neutral-100 font-semibold rounded-md shadow-md hover:shadow-lg transition-all"
      >
        Explore
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </a>
    </CardSpotlight>
  );
}
