import React from 'react';
import { Bug, Database, Globe, LayoutDashboard, LogOut, ShieldAlert } from 'lucide-react';

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'gamedata', label: 'Game Data', icon: Database, roles: ['owner', 'publisher'] },
  { key: 'settings', label: 'Global Control', icon: Globe, roles: ['owner'] },
  { key: 'bugs', label: 'Reports', icon: Bug, roles: ['owner', 'publisher', 'moderator'] },
  { key: 'users', label: 'Personnel', icon: ShieldAlert, roles: ['owner'] },
];

export default function AdminSidebar({ activeTab, setActiveTab, userRole, bugCount, onLogout }) {
  return (
    <aside className="w-full lg:w-80 space-y-4">
      <div className="p-6 bg-[#162031] border border-white/5 rounded-2xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${userRole === 'owner' ? 'bg-red-500' : 'bg-[#2EF2C4]'}`} />
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.28em]">Gnosis Admin</p>
        <h2 className="font-montserrat font-black text-2xl text-white tracking-tight mt-2">Control Console</h2>
        <p className="text-[11px] text-[#2EF2C4] font-black uppercase tracking-[0.24em] mt-2">Role: {userRole}</p>
      </div>

      <nav className="bg-[#162031] border border-white/5 rounded-2xl p-3 space-y-1">
        {navItems.filter((item) => !item.roles || item.roles.includes(userRole)).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          const badge = item.key === 'bugs' ? bugCount : null;
          return (
            <button key={item.key} onClick={() => setActiveTab(item.key)} className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#7A3CFF] text-white shadow-xl shadow-[#7A3CFF]/20' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}>
              <span className="flex items-center gap-3"><Icon size={18} />{item.label}</span>
              {badge !== null ? <span className={`min-w-6 px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white/15 text-white' : 'bg-white/10 text-white/60'}`}>{badge}</span> : null}
            </button>
          );
        })}
      </nav>

      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all">
        <LogOut size={16} /> Sign out
      </button>
    </aside>
  );
}
