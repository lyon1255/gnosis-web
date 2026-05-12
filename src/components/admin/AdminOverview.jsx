import React from 'react';
import { Activity, Server, ShieldCheck, Package, Sparkles, Users, ScrollText, Wand2, History } from 'lucide-react';
import { gameDataSections, mockGameData } from '../../data/gameDataSchemas';

const accentClasses = {
  emerald: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
  violet: 'text-violet-400 border-violet-400/20 bg-violet-400/10',
  sky: 'text-sky-400 border-sky-400/20 bg-sky-400/10',
  amber: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
  fuchsia: 'text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/10',
  slate: 'text-slate-300 border-slate-300/20 bg-slate-300/10',
};
const iconMap = { Package, Sparkles, Users, ScrollText, Wand2, History };

export default function AdminOverview({ stats, systemSettings, setActiveTab }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#162031] p-8 rounded-2xl border border-white/5">
          <Activity className="text-[#2EF2C4] mb-4" size={32} />
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Total Traffic</p>
          <h3 className="text-4xl font-montserrat font-black text-white">{stats.totalViews?.toLocaleString?.() ?? 0}</h3>
        </div>
        <div className="bg-[#162031] p-8 rounded-2xl border border-white/5">
          <Server className={systemSettings.serverStatus === 'online' ? 'text-[#2EF2C4] mb-4' : 'text-red-500 mb-4'} size={32} />
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Server Status</p>
          <h3 className="text-2xl font-montserrat font-black text-white uppercase">{systemSettings.serverStatus}</h3>
        </div>
        <div className="bg-[#162031] p-8 rounded-2xl border border-white/5">
          <ShieldCheck className="text-[#7A3CFF] mb-4" size={32} />
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Frontend Stage</p>
          <h3 className="text-2xl font-montserrat font-black text-white uppercase">UI Preview</h3>
        </div>
      </div>

      <div className="bg-[#162031] rounded-2xl border border-white/5 p-8">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Game Data Modules</p>
            <h3 className="text-2xl font-montserrat font-black text-white mt-2">New content admin surfaces</h3>
            <p className="text-sm text-white/45 mt-3 max-w-2xl">These sections mirror the Auth API content groups and the Unity definitions you shared. For now they are built as clean frontend admin layouts without backend writes.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {gameDataSections.map((section) => {
            const Icon = iconMap[section.icon];
            const count = mockGameData[section.key]?.length ?? 0;
            return (
              <button
                key={section.key}
                onClick={() => setActiveTab(section.key)}
                className="text-left p-5 rounded-2xl border border-white/5 bg-[#0E1624] hover:border-white/10 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${accentClasses[section.accent]}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">{count} records</span>
                </div>
                <h4 className="text-lg font-montserrat font-black text-white mt-4">{section.label}</h4>
                <p className="text-sm text-white/45 mt-2 leading-relaxed">{section.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
