import React, { useMemo, useState } from 'react';
import { Search, Plus, Save, Eye, Filter, ClipboardList } from 'lucide-react';

function InputField({ field, value, onChange }) {
  const base = 'w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4] transition-all';
  if (field.type === 'textarea') {
    return <textarea rows={4} className={`${base} resize-y`} value={value ?? ''} onChange={(e) => onChange(field.key, e.target.value)} />;
  }
  if (field.type === 'select') {
    return (
      <select className={base} value={value ?? ''} onChange={(e) => onChange(field.key, e.target.value)}>
        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#0E1624] border border-white/10 text-sm text-white cursor-pointer">
        <span>{value ? 'Enabled' : 'Disabled'}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(field.key, e.target.checked)} className="w-4 h-4 accent-[#2EF2C4]" />
      </label>
    );
  }
  return <input type={field.type === 'number' ? 'number' : 'text'} className={base} value={value ?? ''} onChange={(e) => onChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)} />;
}

export default function GameDataPage({ sectionKey, schema, records }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [drafts, setDrafts] = useState(records);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return drafts;
    return drafts.filter((entry) => Object.values(entry).some((val) => String(val ?? '').toLowerCase().includes(term)));
  }, [drafts, query]);

  const selected = filtered[selectedIndex] ?? filtered[0] ?? null;

  const updateField = (key, val) => {
    if (!selected) return;
    setDrafts((prev) => prev.map((entry) => (entry === selected ? { ...entry, [key]: val } : entry)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Auth API Surface Preview</p>
          <h2 className="text-3xl font-montserrat font-black text-white mt-2">{schema.title}</h2>
          <p className="text-sm text-white/45 mt-3 max-w-2xl">{schema.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Eye size={14} /> Preview</button>
          <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Save size={14} /> Save Draft</button>
          <button className="px-5 py-3 rounded-xl bg-[#2EF2C4] text-[#0E1624] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_18px_rgba(46,242,196,0.2)]"><Plus size={14} /> New {schema.title.slice(0, -1)}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6 min-h-[70vh]">
        <section className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-white/25" size={16} />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }} placeholder={schema.searchPlaceholder} className="w-full bg-[#0E1624] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
              <span>{filtered.length} records</span>
              <span className="flex items-center gap-1"><Filter size={12} /> frontend preview</span>
            </div>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(70vh-120px)]">
            {filtered.map((entry, index) => {
              const active = selected && entry === selected;
              return (
                <button key={`${sectionKey}-${entry.assetId ?? entry.versionTag ?? index}`} onClick={() => setSelectedIndex(index)} className={`w-full text-left p-4 rounded-2xl border transition-all ${active ? 'bg-[#2EF2C4]/10 border-[#2EF2C4]/50' : 'bg-[#0E1624] border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{entry.displayName ?? entry.versionTag ?? entry.assetId}</p>
                      <p className="text-[11px] text-white/30 font-mono mt-1">{entry.assetId ?? entry.versionTag}</p>
                    </div>
                    <ClipboardList size={16} className={active ? 'text-[#2EF2C4]' : 'text-white/25'} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
          {!selected ? (
            <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-10 text-white/25">
              <ClipboardList size={44} className="mb-4" />
              <p className="font-black uppercase tracking-[0.22em] text-sm">Select a record</p>
            </div>
          ) : (
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Editing</p>
                  <h3 className="text-2xl font-montserrat font-black text-white mt-2">{selected.displayName ?? selected.versionTag ?? selected.assetId}</h3>
                  <p className="text-sm text-white/40 mt-2">Frontend-only layout draft. Backend wiring comes next.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-black uppercase tracking-[0.2em]">Duplicate</button>
                  <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-black uppercase tracking-[0.2em]">Archive</button>
                </div>
              </div>

              {schema.sections.map((section) => (
                <div key={section.title} className="bg-[#0E1624] rounded-2xl border border-white/5 p-5 md:p-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.22em] text-white/35 mb-5">{section.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className={field.full ? 'md:col-span-2' : ''}>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{field.label}</label>
                        <InputField field={field} value={selected[field.key]} onChange={updateField} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
