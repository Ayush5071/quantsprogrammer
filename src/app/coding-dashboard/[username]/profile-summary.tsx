import React from "react";
import Image from "next/image";

interface ProfileSummaryProps {
  avatarUrl: string;
  name: string;
  username: string;
  college?: string;
  bio?: string;
  platform: string;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ avatarUrl, name, username, college, bio, platform }) => (
  <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#181825] border border-white/10 rounded-2xl p-6 mb-6">
    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-500/30">
      <Image src={avatarUrl} alt={name || username} width={96} height={96} className="object-cover w-full h-full" />
    </div>
    <div className="flex-1 text-center sm:text-left">
      <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
        {name || username}
        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full ml-2">{platform}</span>
      </h2>
      <p className="text-gray-400 mb-1">@{username}</p>
      {college && <p className="text-sm text-blue-300 mb-1">{college}</p>}
      {bio && <p className="text-sm text-gray-400 mb-1">{bio}</p>}
    </div>
  </div>
);
