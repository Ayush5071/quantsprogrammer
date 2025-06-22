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
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950 border border-blue-900 rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col justify-between h-full transition-transform hover:scale-[1.03] hover:shadow-2xl w-full max-w-xs md:max-w-md overflow-hidden">
      <div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-blue-300 mb-3 line-clamp-2 leading-tight tracking-tight break-words">
          {title}
        </h2>
        <p className="text-zinc-200 text-sm sm:text-lg mb-5 line-clamp-4 min-h-[4em] sm:min-h-[5em] leading-relaxed break-words">
          {description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-2 sm:gap-0">
        <div className="text-xs sm:text-base text-zinc-400 font-medium">
          <span className="mr-2">By</span>
          <span className="text-blue-400 font-semibold break-all">{author}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href={link}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-800 transition-colors shadow"
          >
            Read
          </a>
          {canEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-green-700 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-800 transition-colors shadow"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-red-700 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-800 transition-colors shadow"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
