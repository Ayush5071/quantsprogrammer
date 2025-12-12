"use client"
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Send, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function InterviewExperienceDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exp, setExp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [expRes, meRes] = await Promise.all([
          axios.get(`/api/interview-experience?id=${params.id}`),
          axios.get('/api/users/me').catch(() => null)
        ]);
        const experience = expRes.data.experience;
        setExp(experience);
        setLikesCount(experience.likes?.length || 0);
        setComments(experience.comments || []);
        if (meRes?.data?.user) {
          setUser(meRes.data.user);
          setLiked(experience.likes?.includes(meRes.data.user._id) || false);
        }
      } catch (err) {
        setExp(null);
      }
      setLoading(false);
    };
    fetch();
  }, [params.id]);

  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  if (loading) return <div className="min-h-[40vh] flex items-center justify-center">Loading...</div>;
  if (!exp) return <div className="min-h-[40vh] flex items-center justify-center text-gray-400">Interview Experience not found or not approved.</div>;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this experience');
      router.push('/auth/login');
      return;
    }
    try {
    const res = await axios.post('/api/interview-experience/like', { expId: params.id });
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
      if (res.data.liked) toast.success('Added to likes');
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please login to comment');
      router.push('/auth/login');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const res = await axios.post('/api/interview-experience/comments', { expId: params.id, content: newComment.trim() });
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment('');
      setShowComments(true);
      setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      setTimeout(() => commentInputRef.current?.focus(), 220);
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-transparent" />
      </div>
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>
          <div className="flex-1" />
          <button onClick={() => router.push('/interview-experiences/add')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Add your experience</button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{exp.title}</h1>
              <div className="text-gray-400">by {exp.authorId?.username || exp.author} • {new Date(exp.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleLike} aria-label={liked ? 'Unlike' : 'Like'} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${liked ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                <Heart className="w-4 h-4" />
                <span className="text-sm">{likesCount}</span>
              </button>
              <button onClick={() => { setShowComments((s) => !s); setTimeout(() => commentInputRef.current?.focus(), 150); }} aria-label="Toggle comments" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments.length}</span>
              </button>
              <div className="relative">
              <button onClick={() => setShowShareMenu(s => !s)} aria-label="Share" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white">
                  <Share2 className="w-4 h-4" />
              </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-[210px] bg-[#0b0b12] border border-white/10 rounded-lg shadow-lg p-2 z-50">
                    <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(exp.title + ' ' + window.location.href)}`, '_blank'); setShowShareMenu(false); }}>WhatsApp</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false); }}>Facebook</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(exp.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false); }}>Twitter</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); setShowShareMenu(false); }}>LinkedIn</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); window.open('https://www.instagram.com', '_blank'); toast.success('Link copied to clipboard. Open Instagram app and paste the link to share.'); }}>Instagram</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-md text-sm" onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); toast.success('Link copied'); }}>Copy link</button>
                  </div>
                )}
              </div>
            </div>
          </div>
      {/* Removed duplicate author line - author shown in header */}
      {exp.subtitle && <div className="text-xl text-gray-300 mb-4">{exp.subtitle}</div>}

          <div className="prose prose-invert max-w-none text-gray-200 mb-6" dangerouslySetInnerHTML={{ __html: exp.content }} />

          <div className="flex items-center gap-3 mt-3 mb-6">
            {exp.company && <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">{exp.company}</span>}
            {(exp.tags || []).slice(0,5).map((t:string) => (
              <span key={t} className="px-2 py-1 bg-white/5 rounded text-gray-300 text-sm">{t}</span>
            ))}
            <div className="ml-auto text-sm text-gray-400">{getReadingTime(exp.content)} min read</div>
          </div>

          {showComments && (
              <div className="mt-6" ref={commentsRef}>
              <div className="mb-4 text-gray-300 font-semibold">Comments</div>
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c._id} className="bg-[#111118] p-3 rounded-lg border border-white/5 flex justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">{c.userName} • <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span></div>
                      <div className="text-gray-200 text-sm">{c.content}</div>
                    </div>
                    {user && user._id === c.userId && (
                      <div className="ml-4 flex-shrink-0">
                        <button onClick={async () => {
                          if (!confirm('Delete this comment?')) return;
                          try {
                            await axios.delete(`/api/interview-experience/comments?expId=${params.id}&commentId=${c._id}`);
                            setComments(prev => prev.filter(x => x._id !== c._id));
                            toast.success('Comment deleted');
                          } catch (err) {
                            toast.error('Failed to delete comment');
                          }
                        }} className="text-xs text-red-400">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input ref={commentInputRef} id="comment-input" value={newComment} onChange={(e)=>setNewComment(e.target.value)} placeholder="Add a public comment" className="flex-1 p-3 rounded-lg bg-[#0e0e12] border border-white/10 text-white" />
                <button onClick={handleAddComment} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Comment</button>
              </div>
            </div>
          )}
        {/* Back button at bottom */}
        <div className="mt-8 flex justify-center">
          <button onClick={() => router.back()} className="px-5 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10">Back</button>
        </div>
      </div>
    </div>
  );
}
