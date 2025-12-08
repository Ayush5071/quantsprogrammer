import React from "react";
import { ResponsiveCalendar } from '@nivo/calendar';

interface HeatmapProps {
  data: Array<{ day: string; value: number }>;
  from: string;
  to: string;
  platform: string;
}

export const CodingHeatmap: React.FC<HeatmapProps> = ({ data, from, to, platform }) => {
  return (
    <div style={{ height: 180 }} className="rounded-xl overflow-hidden bg-[#181825] border border-white/10">
      <ResponsiveCalendar
        data={data}
        from={from}
        to={to}
        emptyColor="#22223b"
        colors={["#3b82f6", "#06b6d4", "#22d3ee", "#a5b4fc", "#facc15"]}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        yearSpacing={40}
        monthBorderColor="#27272a"
        dayBorderWidth={2}
        dayBorderColor="#27272a"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: 'right-to-left',
          },
        ]}
      />
      <div className="text-xs text-gray-400 text-center mt-2">{platform} activity heatmap</div>
    </div>
  );
};
