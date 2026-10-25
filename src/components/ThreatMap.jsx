import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PhoneCall, ExternalLink } from 'lucide-react';
import cityData from '../data/cityData';

export const ThreatMap = () => {
  const navigate = useNavigate();
  const [selected,setSelected] = useState(0);
  const city = cityData[selected];

  return (
    <div className="bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-[#00e5ff]/20 rounded-3xl p-5 shadow-xl dark:shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-5">

      <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">● INDIA CYBER THREAT RADAR</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">National Scam Hotspot Map</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Geospatial tracking of scam hotspots across India.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-[#00e5ff]/10 border border-emerald-200 dark:border-[#00e5ff]/30 px-4 py-2 rounded-2xl">
          <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-[#00e5ff]"/>
          <b className="text-emerald-700 dark:text-[#00e5ff]">Dial 1930</b>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {cityData.map((x,i) => (
          <button key={x.name} onClick={()=>setSelected(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selected===i
                ? 'bg-slate-950 text-white dark:bg-gradient-to-r dark:from-[#00e5ff] dark:to-[#a855f7] dark:text-black dark:font-black shadow-sm'
                : 'bg-slate-100 dark:bg-[#040711] dark:border dark:border-slate-800 text-slate-700 dark:text-slate-300 dark:hover:border-[#00e5ff]/40'
            }`}>
            ● {x.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-slate-950 dark:bg-[#040711] border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between text-xs text-slate-400">
            <b className="text-teal-300 dark:text-[#00e5ff]">● INDIA RADAR</b>
            <span>Click hotspot</span>
          </div>

          <svg viewBox="0 0 460 510" className="w-full">
            <image href="/india.svg" x="0" y="0" width="460" height="510" opacity="0.25"/>

            {cityData.map((x,i) => (
              <g key={x.name} onClick={()=>setSelected(i)} className="cursor-pointer">
                <circle cx={x.x} cy={x.y} r="20" fill="transparent"/>
                <circle cx={x.x} cy={x.y} r={selected===i?12:7}
                  fill={selected===i?(x.risk==='Critical'?'#f43f5e':'#00e5ff'):'none'}
                  stroke={x.risk==='Critical'?'#f43f5e':'#00e5ff'} strokeWidth="2"/>
                <text x={x.x} y={x.y-14} textAnchor="middle" fill="white" fontSize="9">{x.name}</text>
              </g>
            ))}
          </svg>

          <div className="flex justify-between text-xs text-slate-400">
            <span>Selected: <b className="text-white">{city.name}</b></span>
            <b className="text-teal-400 dark:text-[#a855f7]">{cityData.length} Hubs</b>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between">
            <div>
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">{city.risk} Risk</span>
              <p className="text-xs text-slate-500 mt-2">{city.state}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{city.name}</h3>
            </div>
            <div className="text-right">
              <b className="text-2xl text-slate-900 dark:text-white">{city.cases}</b>
              <p className="text-[10px] text-slate-500">REPORTED CASES</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl">
              <p className="text-slate-500">Main Scam Method</p><b className="text-slate-900 dark:text-white">{city.method}</b>
            </div>
            <div className="bg-white dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl">
              <p className="text-slate-500">Average Loss</p><b className="text-rose-600 dark:text-rose-400">{city.loss}</b>
            </div>
          </div>

          <div className="bg-white dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">⚠ Highest Volume Threat</p>
            <b className="text-slate-900 dark:text-white">{city.threat}</b><p className="text-xs text-slate-500 mt-2">{city.description}</p>
          </div>

          <div className="bg-emerald-50 dark:bg-[#080d1a] border border-emerald-200 dark:border-[#00e5ff]/30 p-3 rounded-xl text-xs">
            <b className="text-emerald-700 dark:text-[#00e5ff]">✓ Crucial Safety Rule</b>
            <p className="text-slate-700 dark:text-slate-300">{city.safety}</p>
          </div>

          <button onClick={()=>navigate('/search?q='+encodeURIComponent(city.search))}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-gradient-to-r dark:from-[#00e5ff] dark:via-[#818cf8] dark:to-[#a855f7] text-white dark:text-black font-black text-sm flex justify-center items-center gap-2 shadow-md shadow-[#00e5ff]/20 hover:opacity-95 transition-all">
            Search {city.name} Related Reports <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#040711] border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs flex justify-between items-center">
        <span className="text-slate-600 dark:text-slate-400">● <b>NATIONAL PORTAL:</b> Report immediate financial fraud to freeze accounts.</span>
        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
          className="font-bold flex items-center gap-1 text-teal-700 dark:text-[#00e5ff] hover:dark:text-[#c084fc]">
          cybercrime.gov.in <ExternalLink className="w-3 h-3"/>
        </a>
      </div>
    </div>
  );
};