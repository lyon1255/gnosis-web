import React, { useState } from 'react';
import { GitCommit, Plus, Wrench, Zap, CheckCircle2, Trash2, Edit2, X } from 'lucide-react';
import { AnimatedSection } from '../components/Shared';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function PatchNotes({ patchNotes, isAdmin, isNewUpdate }) {
  const [newNote, setNewNote] = useState({ version: '', title: '', desc: '', added: '', changes: '', fixed: '' });
  const [editingId, setEditingId] = useState(null);

  // ADATOK BEKÜLDÉSE (ÚJ LÉTREHOZÁSA VAGY MÓDOSÍTÁS)
  const submitPatchNote = async () => {
    if (!newNote.version || !newNote.title) {
      alert("Please fill in the Version and Title fields!");
      return;
    }
    
    const noteData = {
      version: newNote.version,
      title: newNote.title,
      date: editingId 
        ? patchNotes.find(n => n.id === editingId).date 
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      timestamp: editingId 
        ? patchNotes.find(n => n.id === editingId).timestamp 
        : Date.now(),
      desc: newNote.desc,
      added: typeof newNote.added === 'string' ? newNote.added.split('\n').filter(l => l.trim() !== '') : newNote.added,
      changes: typeof newNote.changes === 'string' ? newNote.changes.split('\n').filter(l => l.trim() !== '') : newNote.changes,
      fixed: typeof newNote.fixed === 'string' ? newNote.fixed.split('\n').filter(l => l.trim() !== '') : newNote.fixed,
    };

    try {
      if (editingId) {
        // MÓDOSÍTÁS (Firestore UPDATE)
        await updateDoc(doc(db, 'patchNotes', editingId), noteData);
        setEditingId(null);
        alert("Entry updated successfully!");
      } else {
        // ÚJ LÉTREHOZÁSA (Firestore ADD)
        await addDoc(collection(db, 'patchNotes'), noteData);
        alert("New patch note published!");
      }
      // Form ürítése
      setNewNote({ version: '', title: '', desc: '', added: '', changes: '', fixed: '' });
    } catch(err) {
      console.error("Error saving to Firestore:", err);
      alert("Error saving data! Check console for details.");
    }
  };

  // TÖRLÉS FUNKCIÓ (Firestore DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patch note? This action is permanent!")) {
      try {
        await deleteDoc(doc(db, 'patchNotes', id));
      } catch (err) {
        console.error("Error deleting from Firestore:", err);
        alert("Error deleting entry!");
      }
    }
  };



  // SZERKESZTÉS MÓD INDÍTÁSA
  const startEdit = (note) => {
    setEditingId(note.id);
    setNewNote({
      version: note.version,
      title: note.title,
      desc: note.desc,
      added: Array.isArray(note.added) ? note.added.join('\n') : '',
      changes: Array.isArray(note.changes) ? note.changes.join('\n') : '',
      fixed: Array.isArray(note.fixed) ? note.fixed.join('\n') : '',
    });
    // Finom görgetés az űrlaphoz
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SZERKESZTÉS MEGSZAKÍTÁSA
  const cancelEdit = () => {
    setEditingId(null);
    setNewNote({ version: '', title: '', desc: '', added: '', changes: '', fixed: '' });
  };

  return (
    <main className="pt-32 lg:pt-40 pb-20 px-6 md:px-12 lg:px-20 timeline-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* FEJLÉC */}
        <AnimatedSection className="text-center mb-16">
          <span className="font-inter text-[#2EF2C4] text-sm font-bold tracking-[0.2em] uppercase mb-4 block drop-shadow-[0_0_10px_rgba(46,242,196,0.4)]">
            Chronicles of Gnosis
          </span>
          <h1 className="font-montserrat font-black text-4xl md:text-6xl text-[#F4FFFD] mb-6">
            PATCH NOTES
          </h1>
          <p className="font-inter text-[#F4FFFD]/60 max-w-2xl mx-auto">
            Track the evolution of the Sunken Babel. Every update brings us closer to reclaiming our world from the Aether Storm.
          </p>
        </AnimatedSection>

        {/* --- ADMIN CMS PANEL (Csak ha be van lépve) --- */}
        {isAdmin && (
          <AnimatedSection className={`mb-16 bg-[#0E1624]/90 border-2 ${editingId ? 'border-[#7A3CFF]' : 'border-[#2EF2C4]/50'} rounded-xl p-8 shadow-[0_0_30px_rgba(46,242,196,0.15)] relative transition-all duration-500`}>
            <div className={`absolute -top-3 -right-3 ${editingId ? 'bg-[#7A3CFF]' : 'bg-[#2EF2C4]'} text-[#0E1624] text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest shadow-lg`}>
              {editingId ? 'Editing Mode' : 'Developer Tools'}
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className={`font-montserrat font-bold text-2xl ${editingId ? 'text-[#7A3CFF]' : 'text-[#2EF2C4]'} flex items-center gap-2`}>
                {editingId ? <Edit2 className="w-6 h-6"/> : <CheckCircle2 className="w-6 h-6"/>}
                {editingId ? 'Modify Update' : 'Publish New Update'}
              </h3>
              {editingId && (
                <button onClick={cancelEdit} className="text-[#F4FFFD]/50 hover:text-white flex items-center gap-1 text-xs uppercase font-bold transition-colors">
                  <X className="w-4 h-4"/> Cancel
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#F4FFFD]/50 uppercase tracking-widest mb-2">Version</label>
                <input type="text" value={newNote.version} onChange={e=>setNewNote({...newNote, version: e.target.value})} placeholder="e.g. v0.8.5" className="w-full bg-[#0E1624] border border-[#7A3CFF]/30 rounded p-3 text-[#F4FFFD] font-inter focus:outline-none focus:border-[#2EF2C4] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F4FFFD]/50 uppercase tracking-widest mb-2">Title</label>
                <input type="text" value={newNote.title} onChange={e=>setNewNote({...newNote, title: e.target.value})} placeholder="e.g. The Abyssal Update" className="w-full bg-[#0E1624] border border-[#7A3CFF]/30 rounded p-3 text-[#F4FFFD] font-inter focus:outline-none focus:border-[#2EF2C4] transition-colors" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-[#F4FFFD]/50 uppercase tracking-widest mb-2">Short Description</label>
              <textarea value={newNote.desc} onChange={e=>setNewNote({...newNote, desc: e.target.value})} className="w-full bg-[#0E1624] border border-[#7A3CFF]/30 rounded p-3 text-[#F4FFFD] font-inter focus:outline-none focus:border-[#2EF2C4] transition-colors" rows="2"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-[#2EF2C4] uppercase tracking-widest mb-2 flex items-center gap-1"><Plus className="w-3 h-3"/> Added (1 per line)</label>
                <textarea value={newNote.added} onChange={e=>setNewNote({...newNote, added: e.target.value})} className="w-full bg-[#0E1624] border border-[#2EF2C4]/30 rounded p-3 text-[#F4FFFD] text-sm font-inter focus:outline-none focus:border-[#2EF2C4]" rows="4" placeholder="New Zone..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#7A3CFF] uppercase tracking-widest mb-2 flex items-center gap-1"><Zap className="w-3 h-3"/> Changes</label>
                <textarea value={newNote.changes} onChange={e=>setNewNote({...newNote, changes: e.target.value})} className="w-full bg-[#0E1624] border border-[#7A3CFF]/30 rounded p-3 text-[#F4FFFD] text-sm font-inter focus:outline-none focus:border-[#7A3CFF]" rows="4" placeholder="Balanced damage..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Wrench className="w-3 h-3"/> Fixed</label>
                <textarea value={newNote.fixed} onChange={e=>setNewNote({...newNote, fixed: e.target.value})} className="w-full bg-[#0E1624] border border-slate-600 rounded p-3 text-[#F4FFFD] text-sm font-inter focus:outline-none focus:border-slate-400" rows="4" placeholder="Fixed crash..."></textarea>
              </div>
            </div>

            <button 
              onClick={submitPatchNote} 
              className={`w-full ${editingId ? 'bg-[#7A3CFF]' : 'bg-[#2EF2C4]'} hover:brightness-110 text-[#0E1624] font-inter font-bold tracking-widest uppercase py-4 rounded transition-all shadow-lg active:scale-[0.98]`}
            >
              {editingId ? 'Update Log Entry' : 'Publish to Server'}
            </button>
          </AnimatedSection>
        )}

        {/* TIMELINE IDŐVONAL */}
        <div className="relative border-l-2 border-[#7A3CFF]/30 ml-4 md:ml-8 pb-12">
          {patchNotes.map((note, index) => {
            const _isNew = isNewUpdate(note.timestamp);
            const isLatest = index === 0;

            return (
              <AnimatedSection key={note.id} delay={index * 50} className="mb-16 relative pl-8 md:pl-12 group">
                
                {/* Izzó pötty az idővonalon */}
                <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#0E1624] border-2 transition-all duration-300 ${isLatest ? 'border-[#2EF2C4] group-hover:bg-[#2EF2C4] group-hover:shadow-[0_0_15px_#2EF2C4]' : 'border-[#7A3CFF] group-hover:bg-[#7A3CFF] group-hover:shadow-[0_0_15px_#7A3CFF]'}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`border px-4 py-2 rounded inline-flex items-center gap-2 ${isLatest ? 'bg-[#2EF2C4]/10 border-[#2EF2C4]/30' : 'bg-[#7A3CFF]/10 border-[#7A3CFF]/30'}`}>
                      <GitCommit className={`w-4 h-4 ${isLatest ? 'text-[#2EF2C4]' : 'text-[#7A3CFF]'}`} />
                      <span className={`font-montserrat font-bold tracking-widest ${isLatest ? 'text-[#2EF2C4]' : 'text-[#7A3CFF]'}`}>{note.version}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-inter text-[#F4FFFD]/50 text-sm">{note.date}</span>
                      {_isNew && (
                        <span className="ml-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">NEW</span>
                      )}
                    </div>
                  </div>

                  {/* ADMIN MŰVELETEK (Edit/Delete) */}
                  {isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(note)} title="Edit Update" className="p-2 bg-[#0E1624] border border-[#7A3CFF]/30 text-[#7A3CFF] hover:bg-[#7A3CFF] hover:text-white rounded transition-all">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button onClick={() => handleDelete(note.id)} title="Delete Update" className="p-2 bg-[#0E1624] border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  )}
                </div>
                
                <h3 className={`font-montserrat font-black text-2xl md:text-3xl text-[#F4FFFD] mb-4 transition-colors ${isLatest ? 'group-hover:text-[#2EF2C4]' : 'group-hover:text-[#7A3CFF]'}`}>
                  {note.title}
                </h3>
                <p className="font-inter text-[#F4FFFD]/70 leading-relaxed mb-6">
                  {note.desc}
                </p>

                {/* PATCH RÉSZLETEK */}
                <div className="space-y-6">
                  {note.added && note.added.length > 0 && (
                    <div className="bg-[#0E1624]/80 border border-[#7A3CFF]/20 p-5 rounded backdrop-blur-sm shadow-xl">
                      <h4 className="font-inter font-bold text-[#2EF2C4] flex items-center gap-2 mb-3 uppercase text-xs tracking-widest"><Plus className="w-4 h-4"/> Added</h4>
                      <ul className="space-y-2 font-inter text-sm text-[#F4FFFD]/80">
                        {note.added.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-[#2EF2C4]">•</span>
                            <span>
                              {item.includes(':') ? (
                                <>
                                  <strong className="text-white">{item.split(':')[0]}:</strong>
                                  {item.split(':')[1]}
                                </>
                              ) : item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {note.changes && note.changes.length > 0 && (
                    <div className="bg-[#0E1624]/80 border border-[#7A3CFF]/20 p-5 rounded backdrop-blur-sm shadow-xl">
                      <h4 className="font-inter font-bold text-[#7A3CFF] flex items-center gap-2 mb-3 uppercase text-xs tracking-widest"><Zap className="w-4 h-4"/> Balance & Changes</h4>
                      <ul className="space-y-2 font-inter text-sm text-[#F4FFFD]/80">
                        {note.changes.map((item, i) => <li key={i} className="flex gap-2"><span className="text-[#7A3CFF]">•</span>{item}</li>)}
                      </ul>
                    </div>
                  )}

                  {note.fixed && note.fixed.length > 0 && (
                    <div className="bg-[#0E1624]/80 border border-[#7A3CFF]/20 p-5 rounded backdrop-blur-sm shadow-xl">
                      <h4 className="font-inter font-bold text-slate-400 flex items-center gap-2 mb-3 uppercase text-xs tracking-widest"><Wrench className="w-4 h-4"/> Fixed</h4>
                      <ul className="space-y-2 font-inter text-sm text-[#F4FFFD]/80">
                        {note.fixed.map((item, i) => <li key={i} className="flex gap-2"><span className="text-slate-500">•</span>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </main>
  );
}