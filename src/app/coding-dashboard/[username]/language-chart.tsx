"use client";

import React, { useMemo } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  languages: { language: string; count: number }[];
  height?: number;
  color?: string;
}

export const LanguageBarChart: React.FC<Props> = ({ languages = [], height = 200, color = '#60a5fa' }) => {
  const labels = useMemo(() => languages.map(l => l.language), [languages]);
  const dataValues = useMemo(() => languages.map(l => l.count), [languages]);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Files / Repos count',
        data: dataValues,
        backgroundColor: color,
        borderRadius: 8,
      },
    ],
  }), [labels, dataValues, color]);

  const options = useMemo(() => ({
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#b3b3b3' },
        grid: { color: 'transparent' }
      },
      y: {
        ticks: { color: '#b3b3b3' },
        grid: { color: 'transparent' }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
      }
    }
  }), []);

  return (
    <div style={{ height }} className="bg-[#181825] border border-white/10 rounded-2xl p-4">
      <h4 className="text-lg font-semibold mb-2">Top Languages</h4>
      {languages.length === 0 ? (
        <div className="text-gray-400 text-sm">No language data available</div>
      ) : (
        <div style={{ height: height - 36 }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};
