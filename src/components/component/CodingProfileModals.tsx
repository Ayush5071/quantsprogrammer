"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Upload,
  Trash2,
  Loader2,
  User,
  Github,
  Code,
  Trophy,
  Award,
  ExternalLink,
  RefreshCw,
  Plus,
  Check,
  AlertCircle,
  Share2,
  Copy,
  Link,
  Zap,
  Star,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Platform configurations
const platforms = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    color: "from-gray-700 to-gray-900",
    textColor: "text-white",
    placeholder: "your-github-username",
    url: (u: string) => `https://github.com/${u}`,
  },
  {
    id: "leetcode",
    name: "LeetCode",
    icon: Code,
    color: "from-yellow-500 to-orange-500",
    textColor: "text-black",
    placeholder: "your-leetcode-username",
    url: (u: string) => `https://leetcode.com/${u}`,
  },
  {
    id: "codeforces",
    name: "Codeforces",
    icon: Trophy,
    color: "from-blue-500 to-cyan-500",
    textColor: "text-white",
    placeholder: "your-cf-handle",
    url: (u: string) => `https://codeforces.com/profile/${u}`,
  },
  {
    id: "codechef",
    name: "CodeChef",
    icon: Award,
    color: "from-amber-600 to-amber-800",
    textColor: "text-white",
    placeholder: "your-codechef-username",
    url: (u: string) => `https://www.codechef.com/users/${u}`,
  },
];

interface CodingProfile {
  username?: string;
  connected: boolean;
  stats: Record<string, any>;
  lastUpdated?: string;
}

interface CodingProfiles {
  github?: CodingProfile;
  leetcode?: CodingProfile;
  codeforces?: CodingProfile;
  codechef?: CodingProfile;
}

interface Props {
  currentPhoto?: string;
  username: string;
  onPhotoUpdate?: (photo: string | null) => void;
  codingProfiles?: CodingProfiles;
  onProfilesUpdate?: (profiles: CodingProfiles) => void;
}

// Profile Photo Upload Modal
export function ProfilePhotoModal({
  isOpen,
  onClose,
  currentPhoto,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onUpdate: (photo: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Image must be less than 1.5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("[ProfilePhotoModal] FileReader result type:", typeof reader.result, "length:", (reader.result as string)?.length);
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setLoading(true);
    try {
      console.log("[ProfilePhotoModal] Uploading preview type:", typeof preview, "length:", preview.length);
      const res = await fetch("/api/users/profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePhoto: preview }),
      });

      console.log("[ProfilePhotoModal] Fetch response status:", res.status);
      if (!res.ok) {
        const data = await res.json();
        console.log("[ProfilePhotoModal] Error response:", data);
        throw new Error(data.error || "Failed to upload");
      }

      toast.success("Profile photo updated!");
      onUpdate(preview);
      onClose();
    } catch (err: any) {
      console.log("[ProfilePhotoModal] Upload error:", err);
      toast.error(err.message || "Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile-photo", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");

      toast.success("Profile photo removed");
      onUpdate(null);
      onClose();
    } catch (err) {
      toast.error("Failed to remove photo");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Update Profile Photo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                {preview || currentPhoto ? (
                  <Image
                    src={preview || currentPhoto || ""}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Choose Photo
            </button>

            {preview && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                Save Photo
              </button>
            )}

            {currentPhoto && (
              <button
                onClick={handleRemove}
                disabled={loading}
                className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                Remove Photo
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Coding Profiles Modal
export function CodingProfilesModal({
  isOpen,
  onClose,
  codingProfiles,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  codingProfiles?: CodingProfiles;
  onUpdate: (profiles: CodingProfiles) => void;
}) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    if (!usernameInput.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setConnecting(platformId);
    try {
      const res = await fetch("/api/users/coding-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformId,
          username: usernameInput.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to connect");
      }

      toast.success(`${platforms.find((p) => p.id === platformId)?.name} connected!`);

      // Update local state
      onUpdate({
        ...codingProfiles,
        [platformId]: data.profile,
      });

      setSelectedPlatform(null);
      setUsernameInput("");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect profile");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      const res = await fetch(`/api/users/coding-profiles?platform=${platformId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to disconnect");

      toast.success("Profile disconnected");
      onUpdate({
        ...codingProfiles,
        [platformId]: { connected: false, stats: {} },
      });
    } catch (err) {
      toast.error("Failed to disconnect");
    }
  };

  const handleRefresh = async (platformId: string) => {
    setRefreshing(platformId);
    try {
      const res = await fetch("/api/users/coding-profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to refresh");

      toast.success("Stats updated!");
      onUpdate({
        ...codingProfiles,
        [platformId]: {
          ...(codingProfiles as any)?.[platformId],
          stats: data.stats,
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to refresh stats");
    } finally {
      setRefreshing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-2xl w-full my-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-400" />
              Connect Coding Profiles
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-400 mb-6 text-sm">
            Connect your coding profiles to showcase your achievements and track your progress across platforms.
          </p>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {platforms.map((platform) => {
              const profile = (codingProfiles as any)?.[platform.id];
              const isConnected = profile?.connected;
              const Icon = platform.icon;

              return (
                <motion.div
                  key={platform.id}
                  layout
                  className={`p-4 rounded-xl border transition-all ${
                    isConnected
                      ? "bg-gradient-to-br " + platform.color + " border-transparent"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isConnected ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isConnected ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isConnected ? platform.textColor : "text-white"}`}>
                          {platform.name}
                        </h3>
                        {isConnected && (
                          <p className={`text-xs ${isConnected ? "text-white/70" : "text-gray-500"}`}>
                            @{profile.username}
                          </p>
                        )}
                      </div>
                    </div>

                    {isConnected && (
                      <a
                        href={platform.url(profile.username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <ExternalLink className={`w-4 h-4 ${platform.textColor}`} />
                      </a>
                    )}
                  </div>

                  {isConnected ? (
                    <div>
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {platform.id === "github" && (
                          <>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.publicRepos || 0}
                              </div>
                              <div className="text-xs text-white/60">Repos</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.totalStars || 0}
                              </div>
                              <div className="text-xs text-white/60">Stars</div>
                            </div>
                          </>
                        )}
                        {platform.id === "leetcode" && (
                          <>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.totalSolved || 0}
                              </div>
                              <div className="text-xs text-white/60">Solved</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.hardSolved || 0}
                              </div>
                              <div className="text-xs text-white/60">Hard</div>
                            </div>
                          </>
                        )}
                        {platform.id === "codeforces" && (
                          <>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.rating || 0}
                              </div>
                              <div className="text-xs text-white/60">Rating</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.problemsSolved || 0}
                              </div>
                              <div className="text-xs text-white/60">Solved</div>
                            </div>
                          </>
                        )}
                        {platform.id === "codechef" && (
                          <>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {profile.stats?.rating || 0}
                              </div>
                              <div className="text-xs text-white/60">Rating</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 text-center">
                              <div className={`text-lg font-bold ${platform.textColor}`}>
                                {"⭐".repeat(profile.stats?.stars || 0) || "-"}
                              </div>
                              <div className="text-xs text-white/60">Stars</div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRefresh(platform.id)}
                          disabled={refreshing === platform.id}
                          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {refreshing === platform.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          Refresh
                        </button>
                        <button
                          onClick={() => handleDisconnect(platform.id)}
                          className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : selectedPlatform === platform.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder={platform.placeholder}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConnect(platform.id)}
                          disabled={connecting === platform.id}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {connecting === platform.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Connect
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlatform(null);
                            setUsernameInput("");
                          }}
                          className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPlatform(platform.id)}
                      className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-gray-300 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Connect
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Share Profile Modal
export function ShareProfileModal({
  isOpen,
  onClose,
  username,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}) {
  const [copied, setCopied] = useState(false);
  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/u/${username}` : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out my developer profile on QuantsProgrammer! 🚀`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-6 h-6 text-blue-400" />
              Share Your Profile
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Link */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Your Profile URL</label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm truncate">
                {profileUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <button
              onClick={shareOnTwitter}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X (Twitter)
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Share on LinkedIn
            </button>
          </div>

          <p className="text-center text-gray-500 text-xs mt-4">
            Anyone with the link can view your public profile
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Coding Stats Display Component
export function CodingStatsDisplay({
  codingProfiles,
  onManageClick,
}: {
  codingProfiles?: CodingProfiles;
  onManageClick: () => void;
}) {
  const connectedPlatforms = Object.entries(codingProfiles || {}).filter(
    ([_, p]) => (p as CodingProfile)?.connected
  );

  // Calculate total problems solved
  const totalSolved = connectedPlatforms.reduce((total, [platform, profile]) => {
    const p = profile as CodingProfile;
    if (platform === "leetcode") return total + (p.stats?.totalSolved || 0);
    if (platform === "codeforces") return total + (p.stats?.problemsSolved || 0);
    if (platform === "codechef") return total + (p.stats?.problemsSolved || 0);
    return total;
  }, 0);

  if (connectedPlatforms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Connect Your Coding Profiles</h3>
          <p className="text-gray-400 text-sm mb-4">
            Link your GitHub, LeetCode, Codeforces, and CodeChef profiles to showcase your achievements
          </p>
          <button
            onClick={onManageClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Coding Profiles
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Coding Profiles
        </h3>
        <button
          onClick={onManageClick}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Manage
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl text-center">
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{totalSolved}</div>
          <div className="text-xs text-gray-400">Total Solved</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-center">
          <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{connectedPlatforms.length}</div>
          <div className="text-xs text-gray-400">Platforms</div>
        </div>
        {(codingProfiles?.github as CodingProfile)?.connected && (
          <div className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl text-center">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {(codingProfiles?.github as CodingProfile)?.stats?.totalStars || 0}
            </div>
            <div className="text-xs text-gray-400">GitHub Stars</div>
          </div>
        )}
        {(codingProfiles?.codeforces as CodingProfile)?.connected && (
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl text-center">
            <Trophy className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {(codingProfiles?.codeforces as CodingProfile)?.stats?.rating || 0}
            </div>
            <div className="text-xs text-gray-400">CF Rating</div>
          </div>
        )}
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {connectedPlatforms.map(([platformId, profile]) => {
          const platform = platforms.find((p) => p.id === platformId)!;
          const Icon = platform.icon;
          const p = profile as CodingProfile;

          return (
            <a
              key={platformId}
              href={platform.url(p.username || "")}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-xl bg-gradient-to-br ${platform.color} group hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${platform.textColor}`}>{platform.name}</h4>
                  <p className="text-xs text-white/70">@{p.username}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </div>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
