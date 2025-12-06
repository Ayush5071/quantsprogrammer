import React from "react";

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  link: string;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BlogCard({
  title,
  description,
  author,
  link,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: BlogCardProps) {
  return (
    <div className="relative bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-3xl shadow-2xl p-5 sm:p-8 flex flex-col justify-between h-full transition-transform hover:scale-[1.03] hover:shadow-blue-900/40 w-full max-w-xs md:max-w-md overflow-hidden group">
      {/* Glassy grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 line-clamp-2 leading-tight tracking-tight break-words drop-shadow-lg">
          {title}
        </h2>
        <p className="text-zinc-100 text-sm sm:text-lg mb-5 line-clamp-4 min-h-[4em] sm:min-h-[5em] leading-relaxed break-words">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2 sm:gap-0">
          <div className="text-xs sm:text-base text-zinc-300 font-medium">
            <span className="mr-2">By</span>
            <span className="text-blue-300 font-semibold break-all">{author}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href={link}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-800 hover:to-pink-800 transition-all shadow-lg border border-blue-400/40"
            >
              Read
            </a>
            {canEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-700 via-green-600 to-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-green-800 hover:to-blue-800 transition-all shadow-lg border border-green-400/40"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-red-700 via-pink-700 to-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-red-800 hover:to-purple-800 transition-all shadow-lg border border-red-400/40"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
