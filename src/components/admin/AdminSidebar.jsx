import React from 'react';
import { LayoutDashboard, Globe, Bug, ShieldAlert, LogOut, Package, Sparkles, Users, ScrollText, Wand2, History } from 'lucide-react';

const icons = {
  overview: LayoutDashboard,
  settings: Globe,
  bugs: Bug,
  users: ShieldAlert,
  items: Package,
  auras: Sparkles,
  entities: Users,
  quests: ScrollText,
  spells: Wand2,
  versions: History,
};

const navGroups = [
  { key: 'overview', label: 'Overview' },
  { key: 'items', label: 'Items' },
  { key: 'auras', label: 'Auras' },
  { key: 'entities', label: 'Entities' },
  { key: 'quests', label: 'Quests' },
  { key: 'spells', label: 'Spells' },
  { key: 'versions', label: 'Versions' },
  { key: 'settings', label: 'Global Control', ownerOnly: true },
  { key: 'bugs', label: 'Reports' },
  { key: 'users', label: 'Personnel', ownerOnly: true },
];

export default function AdminSidebar({ activeTab, setActiveTab, userRole, bugCount, onLogout }) {
  return (
    <aside className="w-full lg:w-80 space-y-4">
      <div className="p-6 bg-[#162031] border border-white/5 rounded-2xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${userRole === 'owner' ? 'bg-red-500' : 'bg-[#2EF2C4]'}`} />
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.28em]">Gnosis Admin</p>
        <h2 className="font-montserrat font-black text-2xl text-white tracking-tight mt-2">Game Data Console</h2>
        <p className="text-[11px] text-[#2EF2C4] font-black uppercase tracking-[0.24em] mt-2">Role: {userRole}</p>
      </div>

      <nav className="bg-[#162031] border border-white/5 rounded-2xl p-3 space-y-1">
        {navGroups
          .filter((item) => !item.ownerOnly || userRole === 'owner')
          .map((item) => {
            const Icon = icons[item.key];
            const isActive = activeTab === item.key;
            const badge = item.key === 'bugs' ? bugCount : null;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-[#7A3CFF] text-white shadow-xl shadow-[#7A3CFF]/20' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                {badge !== null && (
                  <span className={`min-w-6 px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white/15 text-white' : 'bg-white/10 text-white/60'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
      >
        <LogOut size={16} /> Sign out
      </button>
    </aside>
  );
}
