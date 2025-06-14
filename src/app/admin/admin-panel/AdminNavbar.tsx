import React from "react";
import { useRouter } from "next/navigation";

const AdminNavbar = () => {
  const router = useRouter();
  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-bold text-white tracking-wide cursor-pointer" onClick={() => router.push("/admin/admin-panel")}>Admin Panel</div>
      <div className="flex gap-6">
        <button className="text-white hover:text-blue-300 font-semibold" onClick={() => router.push("/admin/admin-panel/roadmap-create")}>Create Roadmap</button>
        {/* Add more admin links here if needed */}
      </div>
    </nav>
  );
};

export default AdminNavbar;
