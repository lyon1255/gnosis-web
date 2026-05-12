import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, collection, onSnapshot, query, updateDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from '../components/Shared';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import GameDataPage from '../components/admin/GameDataPage';
import { gameDataSchemas, mockGameData } from '../data/gameDataSchemas';
import { CheckCircle } from 'lucide-react';

function GlobalControl({ systemSettings, updateGlobalSettings }) {
  return (
    <div className="bg-[#162031] p-8 rounded-2xl border border-white/5">
      <h3 className="text-xl font-montserrat font-black text-white mb-8 uppercase tracking-tight">Global Network Control</h3>
      <div className="space-y-8">
        <div className="flex items-center justify-between p-6 bg-[#0E1624] rounded-xl border border-white/5">
          <div>
            <h4 className="font-bold text-white mb-1">Maintenance Mode</h4>
            <p className="text-white/40 text-xs uppercase tracking-widest">Restrict public access while admins keep working</p>
          </div>
          <button onClick={() => updateGlobalSettings({ maintenance: !systemSettings.maintenance })} className={`w-14 h-8 rounded-full transition-all relative ${systemSettings.maintenance ? 'bg-red-500' : 'bg-white/10'}`}>
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${systemSettings.maintenance ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Server Status</label>
            <select value={systemSettings.serverStatus} onChange={(e) => updateGlobalSettings({ serverStatus: e.target.value })} className="w-full bg-[#0E1624] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#2EF2C4]">
              <option value="online">Online / Stable</option>
              <option value="congested">High Load / Lag</option>
              <option value="offline">Offline / Down</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Global Announcement</label>
            <input type="text" value={systemSettings.announcement} onChange={(e) => updateGlobalSettings({ announcement: e.target.value })} placeholder="Type alert message..." className="w-full bg-[#0E1624] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#2EF2C4]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BugReports({ displayedBugs, bugFilter, setBugFilter, updateBugStatus }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-montserrat font-black text-white uppercase">Neural Anomalies</h3>
        <div className="flex bg-[#162031] rounded-lg p-1 border border-white/5">
          {['new', 'resolved', 'all'].map((f) => (
            <button key={f} onClick={() => setBugFilter(f)} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${bugFilter === f ? 'bg-[#7A3CFF] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {displayedBugs.length === 0 ? (
          <div className="p-20 bg-[#162031] rounded-2xl text-center border border-white/5">
            <CheckCircle className="mx-auto mb-4 text-[#2EF2C4] opacity-20" size={48} />
            <p className="text-white/20 font-black uppercase tracking-widest text-xs">No anomalies detected</p>
          </div>
        ) : displayedBugs.map((bug) => (
          <div key={bug.id} className={`bg-[#162031] border border-white/5 p-6 rounded-2xl transition-all ${bug.status === 'resolved' ? 'opacity-40' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-[#7A3CFF]/20 text-[#7A3CFF] text-[10px] font-black rounded uppercase">{bug.category}</span>
                  <span className="text-[#2EF2C4] text-[10px] font-black uppercase">{bug.subCategory}</span>
                  <span className="ml-auto text-[10px] text-white/20 font-bold">{bug.timestamp ? new Date(bug.timestamp).toLocaleString() : ''}</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{bug.title}</h4>
                <p className="text-white/50 text-sm mb-4">{bug.desc}</p>
                <p className="text-[10px] text-white/30 font-black uppercase">{bug.userName}</p>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                <button onClick={() => updateBugStatus(bug.id, bug.status === 'resolved' ? 'new' : 'resolved')} className={`px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${bug.status === 'resolved' ? 'bg-[#2EF2C4] text-[#0E1624]' : 'border border-white/10 text-white hover:bg-white/5'}`}>{bug.status === 'resolved' ? 'Re-open' : 'Resolve'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Personnel({ usersList, updateUserRole }) {
  return (
    <div className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <h3 className="text-xl font-montserrat font-black text-white uppercase">Personnel Database</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest">
            <tr><th className="px-8 py-5">Profile</th><th className="px-8 py-5">Access Level</th><th className="px-8 py-5">Assign</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {usersList.map((u) => (
              <tr key={u.uid} className="hover:bg-white/[0.02]">
                <td className="px-8 py-6 flex items-center gap-4">
                  <img src={u.photoURL} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                  <div><p className="text-white font-bold">{u.name}</p><p className="text-[10px] text-white/30 font-mono uppercase">{u.uid}</p></div>
                </td>
                <td className="px-8 py-6"><span className={`px-3 py-1 rounded text-[10px] font-black uppercase border ${u.role === 'owner' ? 'text-red-400 border-red-400/30' : 'text-white/40 border-white/10'}`}>{u.role || 'default'}</span></td>
                <td className="px-8 py-6">{u.role !== 'owner' ? (<select value={u.role || 'default'} onChange={(e) => updateUserRole(u.uid, e.target.value)} className="bg-[#0E1624] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"><option value="default">Default</option><option value="moderator">Moderator</option><option value="developer">Developer</option></select>) : <span className="text-[10px] font-black text-red-500 uppercase">Master</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard({ stats, userRole }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [bugReports, setBugReports] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [systemSettings, setSettings] = useState({ maintenance: false, announcement: '', serverStatus: 'online' });
  const [bugFilter, setBugFilter] = useState('new');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubBugs = onSnapshot(query(collection(db, 'bugReports')), (snap) => {
      const reports = [];
      snap.forEach((entry) => reports.push({ id: entry.id, ...entry.data() }));
      const filtered = reports.filter((bug) => {
        if (userRole === 'owner') return true;
        if (userRole === 'developer') return ['In-Game', 'Website', 'Other'].includes(bug.category);
        if (userRole === 'moderator') return bug.category === 'Discord';
        return false;
      });
      setBugReports(filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    }, (error) => console.error('Bug loading error:', error));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (entry) => {
      if (entry.exists()) setSettings(entry.data());
    });

    let unsubUsers;
    if (userRole === 'owner') {
      unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        const arr = [];
        snap.forEach((entry) => arr.push({ uid: entry.id, ...entry.data() }));
        setUsersList(arr);
      });
    }

    return () => {
      unsubBugs();
      unsubSettings();
      if (unsubUsers) unsubUsers();
    };
  }, [userRole]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const updateGlobalSettings = async (newData) => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      await setDoc(settingsRef, { ...systemSettings, ...newData }, { merge: true });
    } catch (e) { console.error('Settings update failed:', e); }
  };
  const updateBugStatus = async (id, newStatus) => updateDoc(doc(db, 'bugReports', id), { status: newStatus });
  const updateUserRole = async (uid, newRole) => {
    if (window.confirm(`Promote user to ${newRole.toUpperCase()}?`)) await updateDoc(doc(db, 'users', uid), { role: newRole });
  };
  const displayedBugs = bugReports.filter((bug) => bugFilter === 'all' ? true : bug.status === bugFilter);

  const gameDataKeys = ['items', 'auras', 'entities', 'quests', 'spells', 'versions'];

  return (
    <main className="pt-32 lg:pt-40 pb-20 px-6 md:px-12 lg:px-20 min-h-screen bg-[#0E1624]">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} bugCount={bugReports.filter((b) => b.status === 'new').length} onLogout={handleLogout} />
        <div className="flex-grow min-w-0">
          <AnimatedSection className="space-y-6">
            {activeTab === 'overview' && <AdminOverview stats={stats} systemSettings={systemSettings} setActiveTab={setActiveTab} />}
            {gameDataKeys.includes(activeTab) && <GameDataPage sectionKey={activeTab} schema={gameDataSchemas[activeTab]} records={mockGameData[activeTab]} />}
            {activeTab === 'settings' && userRole === 'owner' && <GlobalControl systemSettings={systemSettings} updateGlobalSettings={updateGlobalSettings} />}
            {activeTab === 'bugs' && <BugReports displayedBugs={displayedBugs} bugFilter={bugFilter} setBugFilter={setBugFilter} updateBugStatus={updateBugStatus} />}
            {activeTab === 'users' && userRole === 'owner' && <Personnel usersList={usersList} updateUserRole={updateUserRole} />}
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
