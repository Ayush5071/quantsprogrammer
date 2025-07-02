"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * NotificationIcon component for admin users only.
 * Shows blog requests that need admin approval/rejection.
 */
export default function NotificationIcon() {
  const [show, setShow] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only fetch user data if component is mounted
    setIsChecking(true);
    axios.get("/api/users/me")
      .then(res => {
        const userData = res.data?.user;
        console.log('NotificationIcon: User data received:', { 
          userData: userData ? { _id: userData._id, isAdmin: userData.isAdmin, role: userData.role } : null 
        });
        // Strict admin check - only set user if they are definitely admin
        if (userData && userData._id && (userData.isAdmin === true || userData.role === 'admin')) {
          console.log('NotificationIcon: User is admin, showing notification icon');
          setUser(userData);
        } else {
          console.log('NotificationIcon: User is not admin, hiding notification icon');
          setUser(null);
        }
      })
      .catch((error) => {
        // If API call fails (user not logged in, etc.), don't show notification
        console.log('NotificationIcon: User check failed:', error.response?.status);
        setUser(null);
      })
      .finally(() => setIsChecking(false));
  }, []);

  useEffect(() => {
    // Only admin users should see and fetch blog requests
    if (show && user && user._id && (user.isAdmin === true || user.role === 'admin')) {
      setLoading(true);
      axios.get("/api/blogs/request/admin").then(res => {
        setRequests(res.data.requests || []);
        setLoading(false);
      }).catch(() => {
        setRequests([]);
        setLoading(false);
      });
    }
  }, [show, user]);

  const handleAction = async (userId: string, status: string) => {
    setActionLoading(userId + status);
    try {
      await axios.patch("/api/blogs/request/admin", { userId, status });
      setRequests((prev) => prev.filter((r) => r.userId !== userId));
      toast.success(`Request ${status}`);
    } catch {
      toast.error("Failed to update request");
    }
    setActionLoading(null);
  };

  if (isChecking) return null; // Don't show anything while checking user status
  
  if (!user) return null; // Don't show if no user or not admin
  
  if (!user.isAdmin && user.role !== 'admin') return null; // Double check admin status

  return (
    <div className="fixed top-32 md:top-20 right-4 z-[100] ">
      <button
        onClick={() => setShow(v => !v)}
        className="relative p-1 md:p-3 rounded-full bg-zinc-900 border-2 border-blue-700 hover:bg-blue-900 transition-all shadow-lg"
        title="Notifications"
      >
        <svg className="md:w-7 md:h-7 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {requests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">{requests.length}</span>
        )}
      </button>
      {show && (
        <div className="absolute right-0 mt-2 w-80 max-w-[95vw] sm:w-96 bg-zinc-900 border border-blue-700 rounded-xl shadow-2xl p-4 z-50"
          style={{ minWidth: '260px' }}>
          <h2 className="text-lg font-bold text-blue-400 mb-2">Blog Requests</h2>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-gray-400">No pending requests.</div>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {requests.map((req, idx) => (
                <li key={req._id || idx} className="bg-zinc-800 rounded-lg p-3 flex flex-col">
                  <span className="text-white font-semibold">User ID: {req.userId}</span>
                  <span className="text-gray-400 text-xs">Requested At: {new Date(req.requestedAt).toLocaleString()}</span>
                  <span className="text-blue-400 text-xs mt-1 mb-2">Status: {req.status}</span>
                  {user && user._id && (user.isAdmin === true || user.role === 'admin') && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <button
                        className="px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800 text-xs disabled:opacity-60"
                        disabled={actionLoading === req.userId + 'accepted'}
                        onClick={() => handleAction(req.userId, "accepted")}
                      >
                        {actionLoading === req.userId + 'accepted' ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 text-xs disabled:opacity-60"
                        disabled={actionLoading === req.userId + 'rejected'}
                        onClick={() => handleAction(req.userId, "rejected")}
                      >
                        {actionLoading === req.userId + 'rejected' ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
