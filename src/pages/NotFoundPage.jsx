import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-cyan-500/20 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl backdrop-blur-xl">
        
        {/* 404 Badge */}
        <div className="space-y-2">
          <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] font-mono tracking-tight">
            404
          </span>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight font-display">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            The page you are looking for doesn't exist, has been removed, or the link may be broken.
          </p>
        </div>

        {/* Simple Return Home CTA */}
        <div className="pt-2">
          <Link
            to="/"
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00e5ff]/20 active:scale-95"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
