import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Database, Search, Filter, ArrowUpDown,
  PlusCircle, AlertCircle, X
} from 'lucide-react';
import { useScams } from '../context/ScamContext';
import { ScamCard } from '../components/ScamCard';

// ── STATIC DATA ───────────────────────────────────────────────────────────────

const SCAM_TYPES = ['All', 'Website', 'Email', 'Phone Call', 'SMS', 'Social Media', 'Other'];

const SORT_OPTIONS = [
  { value: 'newest',       label: 'Newest First'                  },
  { value: 'oldest',       label: 'Oldest First'                  },
  { value: 'most_reported',label: 'Most Affected (Confirmations)' },
];

// ── SHARED CLASSNAMES ─────────────────────────────────────────────────────────

const INPUT_CLS = 'bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/20 font-medium transition-all';

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export const DatabasePage = () => {
  const { scams } = useScams();
  const [searchParams] = useSearchParams();
  const [selectedType,   setSelectedType]   = useState('All');
  const [searchKeyword,  setSearchKeyword]  = useState(searchParams.get('q') || '');
  const [sortBy,         setSortBy]         = useState('newest');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchKeyword(q);
    }
  }, [searchParams]);

  const isFiltered = selectedType !== 'All' || searchKeyword.trim().length > 0;

  const clearFilters = () => {
    setSelectedType('All');
    setSearchKeyword('');
    setSortBy('newest');
  };

  const filteredScams = useMemo(() => {
    const q = searchKeyword.toLowerCase().trim();

    return [...scams]
      .filter(s => selectedType === 'All' || s.scamType === selectedType)
      .filter(s => !q || ['title','identifier','secondaryIdentifier','description','summary']
        .some(k => s[k]?.toLowerCase().includes(q)))
      .sort((a, b) => {
        if (sortBy === 'newest')        return new Date(b.incidentDate || 0) - new Date(a.incidentDate || 0);
        if (sortBy === 'oldest')        return new Date(a.incidentDate || 0) - new Date(b.incidentDate || 0);
        if (sortBy === 'most_reported') return (b.meTooCount || 0) - (a.meTooCount || 0);
        return 0;
      });
  }, [scams, selectedType, searchKeyword, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* 1 ── HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-[#00e5ff] text-xs font-bold font-mono mb-2">
            <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00e5ff]" />
            Verified Scam Repository
          </div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight font-display">
            Community Scam Database
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Browse, filter, and inspect verified scam incident dossiers filed by community members.
          </p>
        </div>
        <Link to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-sm shadow-lg shadow-[#00e5ff]/25 active:scale-[0.98] transition-all shrink-0 self-start md:self-auto">
          <PlusCircle className="w-4 h-4 stroke-[2.5]" /> Report New Scam
        </Link>
      </div>

      {/* 2 ── CONTROL BAR */}
      <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-cyan-500/20 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cyan-600 dark:text-[#00e5ff] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="Filter by keyword, website, phone, or title..."
              className={`w-full pl-10 pr-9 py-2.5 ${INPUT_CLS}`}
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" /> Sort:
            </label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className={`w-full sm:w-auto px-3 py-2.5 text-xs sm:text-sm font-bold ${INPUT_CLS}`}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="dark:bg-[#080d1a]">{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 shrink-0 mr-1 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Type:
          </span>
          {SCAM_TYPES.map(type => (
            <button key={type} onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedType === type
                  ? 'bg-slate-950 text-white dark:bg-[#00e5ff] dark:text-black font-black shadow-sm'
                  : 'bg-white dark:bg-[#040711] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm'
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 3 ── RESULTS META ROW */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-mono font-bold">{filteredScams.length}</strong> of{' '}
            <strong className="text-slate-700 dark:text-slate-300 font-mono font-bold">{scams.length}</strong> reports
          </span>
          {isFiltered && (
            <span className="bg-purple-50 text-purple-800 dark:bg-purple-500/20 dark:text-[#c084fc] px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/30 font-bold font-mono">
              Filtered
            </span>
          )}
        </div>
        {isFiltered && (
          <button onClick={clearFilters}
            className="text-cyan-600 hover:text-cyan-700 dark:text-[#00e5ff] font-bold hover:underline flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Reset all filters
          </button>
        )}
      </div>

      {/* 4 ── GRID or EMPTY STATE */}
      {filteredScams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScams.map(scam => <ScamCard key={scam.id} scam={scam} />)}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#080d1a]/80 border border-slate-200 dark:border-cyan-500/20 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#040711] flex items-center justify-center mx-auto border border-slate-200 dark:border-white/10">
            <AlertCircle className="w-7 h-7 text-cyan-500 dark:text-[#00e5ff]" />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white font-display">No Reports Match Your Filter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            No results for category "{selectedType}" or keyword "{searchKeyword}". Try resetting your filters or report this incident yourself.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors">
              Clear Filters
            </button>
            <Link to="/report"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-xs transition-all shadow-md shadow-[#00e5ff]/25">
              Report This Scam
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};