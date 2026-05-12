import React, { useState } from 'react';
import { Bug, X, Send } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function BugReportModal({ isOpen, onClose, user }) {
  const [bugReport, setBugReport] = useState({ title: '', desc: '', category: '', subCategory: '' });

  const bugCategories = {
    'In-Game': ['Gameplay', 'Currency Problem', 'Stuck', 'Visual/UI', 'Performance'],
    'Website': ['Login Error', 'UI Bug', 'Missing Info'],
    'Discord': ['Permission Issue', 'Bot Error', 'Role Problem'],
    'Other': ['Suggestion', 'General Feedback']
  };

  const submitBugReport = async () => {
    if (!bugReport.category || !bugReport.title || !bugReport.desc) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await addDoc(collection(db, 'bugReports'), {
        ...bugReport,
        userName: user?.displayName || 'Anonymous Survivor',
        timestamp: Date.now(),
        status: 'new'
      });
      alert("Anomaly data transmitted. Thank you, survivor.");
      setBugReport({ title: '', desc: '', category: '', subCategory: '' });
      onClose();
    } catch (e) {
      console.error(e);
      alert("Transmission failed. The Rift is unstable.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0E1624]/95 backdrop-blur-md p-4">
      <div className="bg-[#162031] border border-[#7A3CFF]/30 p-8 rounded-xl shadow-2xl max-w-lg w-full text-sm">
        <div className="flex justify-between items-center mb-6 text-[#2EF2C4] font-montserrat font-black text-2xl tracking-tighter">
          <h2 className="flex items-center gap-2 uppercase"><Bug/> Anomaly Detected</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X/></button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <select 
            value={bugReport.category} 
            onChange={e => setBugReport({...bugReport, category: e.target.value, subCategory: ''})} 
            className="bg-[#0E1624] border border-white/10 rounded p-3 text-white outline-none focus:border-[#2EF2C4]"
          >
            <option value="">Category</option>
            {Object.keys(bugCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            disabled={!bugReport.category} 
            value={bugReport.subCategory} 
            onChange={e => setBugReport({...bugReport, subCategory: e.target.value})} 
            className="bg-[#0E1624] border border-white/10 rounded p-3 text-white outline-none disabled:opacity-30"
          >
            <option value="">Sub-category</option>
            {bugReport.category && bugCategories[bugReport.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>

        <input 
          type="text" 
          placeholder="Short Summary" 
          value={bugReport.title} 
          onChange={e=>setBugReport({...bugReport, title: e.target.value})} 
          className="w-full bg-[#0E1624] border border-white/10 rounded p-3 mb-4 text-white focus:border-[#2EF2C4] outline-none" 
        />
        
        <textarea 
          placeholder="Technical details (How to reproduce?)..." 
          value={bugReport.desc} 
          onChange={e=>setBugReport({...bugReport, desc: e.target.value})} 
          className="w-full bg-[#0E1624] border border-white/10 rounded p-3 mb-6 h-32 text-white resize-none focus:border-[#2EF2C4] outline-none" 
        />

        <button 
          onClick={submitBugReport} 
          className="w-full bg-[#7A3CFF] hover:bg-[#2EF2C4] hover:text-[#0E1624] py-4 rounded font-black transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Send size={18}/> Transmit Data
        </button>
      </div>
    </div>
  );
}