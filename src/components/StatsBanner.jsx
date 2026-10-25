import React, { useEffect, useState } from 'react';
import { ShieldCheck, Database, Zap, Activity } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const StatsBanner = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    scamsDetected: 0,
    datasetSize: 15000,
    accuracyRate: '98.6%'
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-slate-800 hover:dark:border-[#00e5ff]/40 rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-all">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#00e5ff]">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{stats.totalAnalyses}</p>
          <p className="text-[11px] font-medium text-slate-400">Total Scans Run</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-slate-800 hover:dark:border-rose-500/40 rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-all">
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{stats.scamsDetected}</p>
          <p className="text-[11px] font-medium text-slate-400">Threats Flagged</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-slate-800 hover:dark:border-[#00e5ff]/40 rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-all">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#00e5ff]">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{stats.datasetSize.toLocaleString()}</p>
          <p className="text-[11px] font-medium text-slate-400">RAG Dataset Records</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-slate-800 hover:dark:border-[#a855f7]/40 rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-all">
        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-[#c084fc]">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{stats.accuracyRate}</p>
          <p className="text-[11px] font-medium text-slate-400">Model Precision</p>
        </div>
      </div>
    </div>
  );
};