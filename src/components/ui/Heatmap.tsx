"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type Day = { day: string; value: number };

// Build week columns with rows Sun(0) -> Sat(6)
function buildWeeks(days: Day[]) {
  if (!days || days.length === 0) return [] as Day[][];
  // Map by date
  const map = new Map(days.map(d => [d.day, d.value]));
  // find min and max dates
  const parsed = days.map(d => new Date(d.day));
  const min = new Date(Math.min(...parsed.map(d => d.getTime())));
  const max = new Date(Math.max(...parsed.map(d => d.getTime())));

  // backfill to nearest previous Sunday
  const start = new Date(min);
  start.setDate(start.getDate() - ((start.getDay() + 7) % 7));
  // forward to nearest Saturday
  const end = new Date(max);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const weeks: Day[][] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().slice(0, 10);
    const weekIndex = Math.floor(( (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / (1000 * 60 * 60 * 24) ) / 7);
    if (!weeks[weekIndex]) weeks[weekIndex] = [] as Day[];
    weeks[weekIndex].push({ day: dayStr, value: Number(map.get(dayStr) || 0) });
  }
  return weeks;
}

export default function Heatmap({ days, size = 10, color = '#10b981' }: { days: Day[]; size?: number; color?: string }) {
  const weeks = useMemo(() => buildWeeks(days), [days]);
  const max = Math.max(...days.map(d => d.value), 1);

  if (weeks.length === 0) return <div className="text-sm text-gray-400">No activity</div>;

  return (
    <div className="flex gap-1 items-start">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((d, ri) => {
            const intensity = Math.min(1, d.value / max);
            const alpha = 0.12 + intensity * 0.88;
            const bg = `rgba(16,185,129,${alpha})`;
            return (
              <motion.div
                key={d.day}
                title={`${d.day}: ${d.value}`}
                className="rounded-sm"
                style={{ width: size, height: size, background: bg }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
