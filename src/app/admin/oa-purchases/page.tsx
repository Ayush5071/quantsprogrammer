"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useCurrentUser from "@/lib/useCurrentUser";
import Link from "next/link";
import { 
  ArrowLeft, 
  Unlock, 
  Users, 
  Search, 
  CheckCircle2, 
  Loader2,
  Crown,
  Mail
} from "lucide-react";

interface PurchasedUser {
  email: string;
  username: string;
  purchasedAt: string;
  paymentId: string;
}

export default function OAPurchasesPage() {
  const [purchasedUsers, setPurchasedUsers] = useState<PurchasedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlockEmail, setUnlockEmail] = useState("");
  const [unlockPaymentId, setUnlockPaymentId] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState("");
  const user = useCurrentUser();

  useEffect(() => {
    // undefined = still loading, wait
    if (user === undefined) return;
    
    // null = not logged in or user loaded without admin
    if (user === null || !user?.isAdmin) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/api/admin/unlock-oa");
      setPurchasedUsers(response.data.users || []);
    } catch (err) {
      setError("Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockEmail) return;

    setUnlocking(true);
    setUnlockMessage("");

    try {
      const response = await axios.post("/api/admin/unlock-oa", {
        email: unlockEmail,
        paymentId: unlockPaymentId || undefined,
      });
      
      setUnlockMessage(`✅ ${response.data.message}`);
      setUnlockEmail("");
      setUnlockPaymentId("");
      fetchPurchases(); // Refresh list
    } catch (err: any) {
      setUnlockMessage(`❌ ${err.response?.data?.error || "Failed to unlock"}`);
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/admin/admin-panel" className="text-blue-400 hover:text-blue-300">
            Go to Admin Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/admin-panel"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Panel
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            OA Questions Purchases
          </h1>
          <p className="text-gray-400 mt-1">
            Manage OA questions access for users
          </p>
        </div>

        {/* Unlock Form */}
        <div className="bg-[#111118] border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Unlock className="w-5 h-5 text-green-400" />
            Unlock OA Questions for User
          </h2>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">User Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={unlockEmail}
                  onChange={(e) => setUnlockEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Payment ID (optional)</label>
              <input
                type="text"
                value={unlockPaymentId}
                onChange={(e) => setUnlockPaymentId(e.target.value)}
                placeholder="Instamojo Payment ID"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={unlocking || !unlockEmail}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {unlocking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Unlock className="w-5 h-5" />
              )}
              Unlock Access
            </button>

            {unlockMessage && (
              <p className={`text-sm ${unlockMessage.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
                {unlockMessage}
              </p>
            )}
          </form>
        </div>

        {/* Purchased Users List */}
        <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Users with OA Access ({purchasedUsers.length})
          </h2>

          {purchasedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users have purchased yet</p>
          ) : (
            <div className="space-y-3">
              {purchasedUsers.map((pUser, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{pUser.username}</p>
                    <p className="text-gray-400 text-sm">{pUser.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Purchased
                    </p>
                    <p className="text-gray-500 text-xs">
                      {pUser.purchasedAt ? new Date(pUser.purchasedAt).toLocaleDateString() : "N/A"}
                    </p>
                    {pUser.paymentId && (
                      <p className="text-gray-600 text-xs font-mono">{pUser.paymentId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
