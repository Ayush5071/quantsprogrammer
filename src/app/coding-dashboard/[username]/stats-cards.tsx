import React from "react";
import { Github, Code2, Award, Zap } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`flex flex-col items-center justify-center bg-gradient-to-br ${color} rounded-xl p-4 min-w-[120px]`}>
    <div className="mb-2">{icon}</div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-200">{title}</div>
  </div>
);

interface StatsCardsProps {
  stats: Array<{ title: string; value: string | number; icon: React.ReactNode; color: string }>;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    {stats.map((stat, idx) => (
      <StatCard key={idx} {...stat} />
    ))}
  </div>
);
