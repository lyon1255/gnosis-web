import React from 'react';
import { Activity, Database, ScrollText, Server, ShieldCheck } from 'lucide-react';

export default function AdminOverview({ stats, systemSettings, setActiveTab, canEditGameData }) {
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
          <h3 className="text-2xl font-montserrat font-black text-white uppercase">Quest Editor Ready</h3>
        </div>
      </div>

      <div className="bg-[#162031] rounded-2xl border border-white/5 p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Separated Admin Areas</p>
        <h3 className="text-2xl font-montserrat font-black text-white mt-2">Game Data is now its own workspace</h3>
        <p className="text-sm text-white/45 mt-3 max-w-2xl">The Unity-style content editing modules are separated from the general admin dashboard. Only Owner and Publisher can open the Game Data workspace.</p>
        {canEditGameData ? (
          <button onClick={() => setActiveTab('gamedata')} className="mt-6 px-5 py-3 rounded-xl bg-[#2EF2C4] text-[#0E1624] text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-2"><Database size={14} /> Open Game Data</button>
        ) : (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/50 text-xs font-black uppercase tracking-[0.2em]"><ScrollText size={14} /> Read-only role: no Game Data access</div>
        )}
      </div>
    </div>
  );
}
