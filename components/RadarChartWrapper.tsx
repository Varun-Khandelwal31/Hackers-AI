'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { EvaluationScores } from '@/lib/types';

interface RadarChartProps {
  scores: EvaluationScores;
  projectName?: string;
  animated?: boolean;
}

export default function RadarChartWrapper({ scores, animated = true }: RadarChartProps) {
  const chartData = [
    { category: 'Innovation', score: scores.innovation, topAvg: 8.5, fullMark: 10 },
    { category: 'UX', score: scores.ux, topAvg: 8.3, fullMark: 10 },
    { category: 'Completeness', score: scores.completeness, topAvg: 7.9, fullMark: 10 },
    { category: 'Technical', score: scores.technical, topAvg: 8.3, fullMark: 10 },
  ];

  return (
    <div className="w-full h-64 sm:h-72 relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={45}
            domain={[0, 10]}
            tick={{ fill: '#64748b', fontSize: 9 }}
            stroke="#1e293b"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#6366f1',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
            }}
            formatter={(value: any, name: any) => [
              `${value} / 10`,
              name === 'score' ? 'Team Score' : 'Top 10 Avg',
            ]}
          />
          <Radar
            name="Top 10 Avg"
            dataKey="topAvg"
            stroke="#38bdf8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="#0284c7"
            fillOpacity={0.15}
            isAnimationActive={animated}
          />
          <Radar
            name="score"
            dataKey="score"
            stroke="#818cf8"
            strokeWidth={2.5}
            fill="#6366f1"
            fillOpacity={0.45}
            isAnimationActive={animated}
            animationDuration={850}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend below chart */}
      <div className="flex items-center space-x-6 text-[11px] font-semibold pt-1">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-brand-500 border border-brand-400" />
          <span className="text-slate-300">Team Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-400 border-dashed" />
          <span className="text-slate-400">Top 10 Avg</span>
        </div>
      </div>
    </div>
  );
}
