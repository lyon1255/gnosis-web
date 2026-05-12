import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Package, Plus, Search, ShieldAlert, Trash2 } from 'lucide-react';
import {
  ARMOR_TYPES,
  EQUIPMENT_SLOTS,
  ITEM_BIND_TYPES,
  ITEM_RARITIES,
  ITEM_TYPE_OPTIONS,
  PROFESSION_TYPES,
  WEAPON_TYPES,
} from '../../data/gameDataMock';
import { createEmptyStatSheet, createItemTemplate, hydrateGameData, inferItemClassType, inferItemType } from './gameDataSync';

const inputClass = 'w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]';
const statFields = ['AD', 'AP', 'AttackSpeed', 'CritChance', 'MaxHealth', 'Defense', 'MaxMana', 'AbilityHaste', 'MoveSpeed'];

const byId = (list, id) => list.find((entry) => entry.id === id);
const optionLabel = (list, value, fallback = 'Unknown') => list.find((entry) => entry.value === value)?.label ?? fallback;

function SectionCard({ title, colorClass, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between px-5 py-4 text-left border-b border-white/5 bg-white/[0.02]">
        <span className={`text-sm font-black tracking-wide ${colorClass}`}>{title}</span>
        {open ? <ChevronDown size={18} className="text-white/35" /> : <ChevronRight size={18} className="text-white/35" />}
      </button>
      {open ? <div className="p-5 md:p-6">{children}</div> : null}
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">{label}</label>
      {children}
    </div>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <Field label={label}>
      <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1624] px-4 py-3 text-sm text-white cursor-pointer">
        <span>{checked ? 'Enabled' : 'Disabled'}</span>
        <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="w-4 h-4 accent-[#2EF2C4]" />
      </label>
    </Field>
  );
}

function DefinitionPicker({ label, value, onChange, options, emptyLabel }) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <select className={inputClass} value={value || ''} onChange={(event) => onChange(event.target.value)}>
          <option value="">{emptyLabel || 'Select Entry...'}</option>
          {options.map((option) => <option key={option.id} value={option.id}>{option.displayName} ({option.id})</option>)}
        </select>
        {value ? <button type="button" onClick={() => onChange('')} className="px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white">X</button> : null}
      </div>
    </Field>
  );
}

function StatSheetEditor({ label, stats, onChange, accent }) {
  const nextStats = stats || createEmptyStatSheet();
  return (
    <div className="bg-[#0E1624] border border-white/5 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className={`text-xs font-black uppercase tracking-[0.2em] ${accent}`}>{label}</p>
        <button
          type="button"
          onClick={() => onChange(createEmptyStatSheet())}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35 hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/25 mb-2">Basic Attack Min</label>
          <input type="number" className={inputClass} value={nextStats.BasicAttack?.x ?? 0} onChange={(event) => onChange({ ...nextStats, BasicAttack: { x: Number(event.target.value || 0), y: Number(nextStats.BasicAttack?.y || 0) } })} />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/25 mb-2">Basic Attack Max</label>
          <input type="number" className={inputClass} value={nextStats.BasicAttack?.y ?? 0} onChange={(event) => onChange({ ...nextStats, BasicAttack: { x: Number(nextStats.BasicAttack?.x || 0), y: Number(event.target.value || 0) } })} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {statFields.map((field) => (
          <div key={`${label}-${field}`}>
            <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-white/25 mb-2">{field}</label>
            <input
              type="number"
              className={inputClass}
              value={nextStats[field] ?? 0}
              onChange={(event) => onChange({ ...nextStats, [field]: Number(event.target.value || 0) })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function buildIssues(item, data) {
  const issues = [];
  const add = (level, text) => issues.push({ level, text });

  if (!item.displayName?.trim()) add('error', 'Name is missing.');
  if (!item.id?.trim()) add('error', 'Unique database ID is missing.');
  if (Number(item.buyPrice || 0) < 0) add('error', 'Buy price cannot be negative.');
  if (Number(item.sellPrice || 0) < 0) add('error', 'Sell price cannot be negative.');
  if (Number(item.requiredLevel || 0) <= 0) add('warning', 'Required level should be at least 1.');

  if (inferItemType(item) === 'Equipment') {
    if (Number(item.maxStack || 1) !== 1) add('warning', 'Equipment items should keep Max Stack at 1.');
    const isWeaponSlot = Number(item.equipmentSlot) === 8 || Number(item.equipmentSlot) === 9;
    if (isWeaponSlot && Number(item.weaponType || 0) === 0) add('warning', 'Weapon slot items should define a Weapon Type.');
    if (!isWeaponSlot && Number(item.armorType || 0) === 0 && Number(item.equipmentSlot) !== 1 && Number(item.equipmentSlot) !== 6 && Number(item.equipmentSlot) !== 7) {
      add('warning', 'Non-weapon equipment usually needs an Armor Type.');
    }
  }

  if (inferItemType(item) === 'Consumable' && item.grantedAuraId && !byId(data.auras, item.grantedAuraId)) {
    add('error', `Granted Aura reference is invalid: ${item.grantedAuraId}`);
  }

  if (inferItemType(item) === 'Quest' && item.relatedQuestID && !byId(data.quests, item.relatedQuestID)) {
    add('error', `Related Quest reference is invalid: ${item.relatedQuestID}`);
  }

  return issues;
}

function groupedItems(items, search) {
  const term = search.trim().toLowerCase();
  return items
    .filter((item) => {
      if (!term) return true;
      return [item.displayName, item.id, inferItemType(item), inferItemClassType(item)]
        .some((value) => String(value || '').toLowerCase().includes(term));
    })
    .reduce((acc, item) => {
      const type = inferItemType(item);
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
}

export default function ItemEditorPage({ data, onDataChange }) {
  const hydrated = useMemo(() => hydrateGameData(data), [data]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(hydrated.items[0]?.id || '');

  const groups = useMemo(() => groupedItems(hydrated.items, search), [hydrated.items, search]);
  useEffect(() => {
    if (!hydrated.items.length) {
      setSelectedId('');
      return;
    }
    if (!hydrated.items.some((item) => item.id === selectedId)) {
      setSelectedId(hydrated.items[0].id);
    }
  }, [hydrated.items, selectedId]);

  const selectedItem = hydrated.items.find((item) => item.id === selectedId) || hydrated.items[0] || null;
  const issues = selectedItem ? buildIssues(selectedItem, hydrated) : [];

  const patchItems = (updater) => {
    const nextItems = updater(hydrated.items);
    onDataChange({ ...hydrated, items: nextItems });
  };

  const updateItem = (patch) => {
    if (!selectedItem) return;
    patchItems((items) => items.map((item) => {
      if (item.id !== selectedItem.id) return item;
      const next = {
        ...item,
        ...patch,
      };

      if (patch.displayName !== undefined && patch.id === undefined) {
        next.id = `item_${String(patch.displayName || '').trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
      }

      next.itemType = inferItemType(next);
      next.classType = inferItemClassType(next);

      if (next.itemType === 'Equipment') {
        next.maxStack = 1;
        const isWeaponSlot = Number(next.equipmentSlot) === 8 || Number(next.equipmentSlot) === 9;
        if (isWeaponSlot) {
          next.armorType = 0;
        } else {
          next.weaponType = 0;
          next.isTwoHanded = false;
        }
      }

      if (next.itemType !== 'Consumable') {
        next.healthRestore = 0;
        next.manaRestore = 0;
        next.grantedAuraId = '';
        next.auraLevel = 0;
      }

      if (next.itemType !== 'Material') {
        next.relatedProfession = 0;
        next.materialTier = 1;
      }

      if (next.itemType !== 'Quest') {
        next.relatedQuestID = '';
      }

      return next;
    }));
  };

  const createItem = () => {
    const created = createItemTemplate();
    patchItems((items) => [created, ...items]);
    setSelectedId(created.id);
  };

  const removeItem = () => {
    if (!selectedItem) return;
    const remaining = hydrated.items.filter((item) => item.id !== selectedItem.id);
    onDataChange({ ...hydrated, items: remaining });
    setSelectedId(remaining[0]?.id || '');
  };

  const setItemType = (itemType) => {
    const base = createItemTemplate();
    const classType = inferItemClassType({ itemType });
    updateItem({
      ...base,
      ...selectedItem,
      itemType,
      classType,
      maxStack: itemType === 'Equipment' ? 1 : selectedItem.maxStack,
      statModifiersFlat: itemType === 'Equipment' ? (selectedItem.statModifiersFlat || createEmptyStatSheet()) : createEmptyStatSheet(),
      statModifiersPercent: itemType === 'Equipment' ? (selectedItem.statModifiersPercent || createEmptyStatSheet()) : createEmptyStatSheet(),
      equipmentSlot: itemType === 'Equipment' ? selectedItem.equipmentSlot : -1,
      weaponType: itemType === 'Equipment' ? selectedItem.weaponType : 0,
      armorType: itemType === 'Equipment' ? selectedItem.armorType : 0,
      isTwoHanded: itemType === 'Equipment' ? selectedItem.isTwoHanded : false,
      maxDurability: itemType === 'Equipment' ? selectedItem.maxDurability : 0,
      healthRestore: itemType === 'Consumable' ? selectedItem.healthRestore : 0,
      manaRestore: itemType === 'Consumable' ? selectedItem.manaRestore : 0,
      grantedAuraId: itemType === 'Consumable' ? selectedItem.grantedAuraId : '',
      auraLevel: itemType === 'Consumable' ? selectedItem.auraLevel : 0,
      relatedProfession: itemType === 'Material' ? selectedItem.relatedProfession : 0,
      materialTier: itemType === 'Material' ? selectedItem.materialTier : 1,
      relatedQuestID: itemType === 'Quest' ? selectedItem.relatedQuestID : '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Game Data / Items</p>
          <h2 className="text-3xl font-montserrat font-black text-white mt-2">Item Editor</h2>
          <p className="text-sm text-white/45 mt-3 max-w-3xl">Unity-style item editing surface for the web. It mirrors the ItemDefinition editor sections and keeps local cache changes ready for PUSH.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={createItem} className="px-5 py-3 rounded-xl bg-[#2EF2C4] text-[#0E1624] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Plus size={14} /> New Item</button>
          <button onClick={removeItem} className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Trash2 size={14} /> Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_320px] gap-6 min-h-[72vh]">
        <section className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-white/25" size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, IDs, types..." className="w-full bg-[#0E1624] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" />
            </div>
            <button onClick={createItem} className="w-full py-3 rounded-xl bg-green-700/80 hover:bg-green-600 text-white text-sm font-black">Create New Item</button>
          </div>
          <div className="p-3 max-h-[72vh] overflow-y-auto space-y-4">
            {Object.entries(groups).map(([type, items]) => (
              <div key={type}>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">{type} ({items.length})</p>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full text-left px-3 py-3 rounded-xl border ${selectedItem?.id === item.id ? 'bg-[#7A3CFF]/20 border-[#7A3CFF]/40 text-white' : 'bg-[#0E1624] border-white/5 text-white/70 hover:border-white/10'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold leading-tight">{item.displayName}</p>
                          <p className="text-[11px] text-white/30 font-mono mt-1">{item.id}</p>
                        </div>
                        <Package size={16} className="text-white/30" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          {selectedItem ? (
            <>
              <div className="bg-[#162031] rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">Editing</p>
                  <h3 className="text-2xl font-montserrat font-black text-white mt-2">{selectedItem.displayName}</h3>
                </div>
                <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-black uppercase tracking-[0.2em]">Frontend Preview Only</button>
              </div>

              <SectionCard title="Item Identity" colorClass="text-sky-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Display Name">
                    <input className={inputClass} value={selectedItem.displayName} onChange={(event) => updateItem({ displayName: event.target.value })} />
                  </Field>
                  <Field label="Unique Database ID">
                    <input className={`${inputClass} opacity-70`} value={selectedItem.id} readOnly />
                  </Field>
                  <Field label="Description" full>
                    <textarea rows={4} className={`${inputClass} resize-y`} value={selectedItem.description} onChange={(event) => updateItem({ description: event.target.value })} />
                  </Field>
                  <Field label="Item Type">
                    <select className={inputClass} value={inferItemType(selectedItem)} onChange={(event) => setItemType(event.target.value)}>
                      {ITEM_TYPE_OPTIONS.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Rarity">
                    <select className={inputClass} value={Number(selectedItem.rarity || 0)} onChange={(event) => updateItem({ rarity: Number(event.target.value) })}>
                      {ITEM_RARITIES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                    </select>
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="General Settings" colorClass="text-white/80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Buy Price"><input type="number" className={inputClass} value={selectedItem.buyPrice} onChange={(event) => updateItem({ buyPrice: Number(event.target.value || 0) })} /></Field>
                  <Field label="Sell Price"><input type="number" className={inputClass} value={selectedItem.sellPrice} onChange={(event) => updateItem({ sellPrice: Number(event.target.value || 0) })} /></Field>
                  <Field label="Required Level"><input type="number" className={inputClass} value={selectedItem.requiredLevel} onChange={(event) => updateItem({ requiredLevel: Number(event.target.value || 1) })} /></Field>
                  <Field label="Max Stack"><input type="number" className={`${inputClass} ${inferItemType(selectedItem) === 'Equipment' ? 'opacity-60' : ''}`} disabled={inferItemType(selectedItem) === 'Equipment'} value={selectedItem.maxStack} onChange={(event) => updateItem({ maxStack: Number(event.target.value || 1) })} /></Field>
                  <Field label="Bind Type">
                    <select className={inputClass} value={Number(selectedItem.bindType || 0)} onChange={(event) => updateItem({ bindType: Number(event.target.value) })}>
                      {ITEM_BIND_TYPES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Cooldown (Seconds)"><input type="number" className={inputClass} value={selectedItem.cooldownDuration} onChange={(event) => updateItem({ cooldownDuration: Number(event.target.value || 0) })} /></Field>
                  <ToggleField label="Tradable" checked={selectedItem.isTradable} onChange={(value) => updateItem({ isTradable: value })} />
                  <ToggleField label="Sellable" checked={selectedItem.isSellable} onChange={(value) => updateItem({ isSellable: value })} />
                  <ToggleField label="Droppable" checked={selectedItem.isDroppable} onChange={(value) => updateItem({ isDroppable: value })} />
                  <ToggleField label="Usable In Combat" checked={selectedItem.isUsableInCombat} onChange={(value) => updateItem({ isUsableInCombat: value })} />
                  <ToggleField label="Unique" checked={selectedItem.isUnique} onChange={(value) => updateItem({ isUnique: value })} />
                  {Number(selectedItem.cooldownDuration || 0) > 0 ? <ToggleField label="Haste Affects Cooldown" checked={selectedItem.abilityHasteAffectsCooldown} onChange={(value) => updateItem({ abilityHasteAffectsCooldown: value })} /> : null}
                </div>
              </SectionCard>

              {inferItemType(selectedItem) === 'Equipment' ? (
                <SectionCard title="Equipment Data" colorClass="text-rose-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <Field label="Equipment Slot">
                      <select className={inputClass} value={Number(selectedItem.equipmentSlot ?? -1)} onChange={(event) => updateItem({ equipmentSlot: Number(event.target.value) })}>
                        {EQUIPMENT_SLOTS.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                      </select>
                    </Field>
                    {(Number(selectedItem.equipmentSlot) === 8 || Number(selectedItem.equipmentSlot) === 9) ? (
                      <>
                        <Field label="Weapon Type">
                          <select className={inputClass} value={Number(selectedItem.weaponType || 0)} onChange={(event) => updateItem({ weaponType: Number(event.target.value), armorType: 0 })}>
                            {WEAPON_TYPES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                          </select>
                        </Field>
                        <ToggleField label="Two-Handed" checked={selectedItem.isTwoHanded} onChange={(value) => updateItem({ isTwoHanded: value })} />
                      </>
                    ) : (
                      <Field label="Armor Type">
                        <select className={inputClass} value={Number(selectedItem.armorType || 0)} onChange={(event) => updateItem({ armorType: Number(event.target.value), weaponType: 0, isTwoHanded: false })}>
                          {ARMOR_TYPES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                        </select>
                      </Field>
                    )}
                    <Field label="Max Durability">
                      <input type="number" className={inputClass} value={selectedItem.maxDurability} onChange={(event) => updateItem({ maxDurability: Number(event.target.value || 0) })} />
                    </Field>
                  </div>

                  <div className="space-y-4">
                    <StatSheetEditor label="Flat Stats" stats={selectedItem.statModifiersFlat} onChange={(value) => updateItem({ statModifiersFlat: value })} accent="text-rose-300" />
                    <StatSheetEditor label="Percent Stats" stats={selectedItem.statModifiersPercent} onChange={(value) => updateItem({ statModifiersPercent: value })} accent="text-amber-200" />
                  </div>
                </SectionCard>
              ) : null}

              {inferItemType(selectedItem) === 'Consumable' ? (
                <SectionCard title="Consumable Data" colorClass="text-emerald-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Health Restore"><input type="number" className={inputClass} value={selectedItem.healthRestore} onChange={(event) => updateItem({ healthRestore: Number(event.target.value || 0) })} /></Field>
                    <Field label="Mana Restore"><input type="number" className={inputClass} value={selectedItem.manaRestore} onChange={(event) => updateItem({ manaRestore: Number(event.target.value || 0) })} /></Field>
                    <DefinitionPicker label="Granted Aura" value={selectedItem.grantedAuraId} onChange={(value) => updateItem({ grantedAuraId: value })} options={hydrated.auras} emptyLabel="Select Aura..." />
                    {selectedItem.grantedAuraId ? <Field label="Aura Level"><input type="number" className={inputClass} value={selectedItem.auraLevel} onChange={(event) => updateItem({ auraLevel: Number(event.target.value || 0) })} /></Field> : null}
                  </div>
                </SectionCard>
              ) : null}

              {inferItemType(selectedItem) === 'Material' ? (
                <SectionCard title="Material Data" colorClass="text-amber-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Related Profession">
                      <select className={inputClass} value={Number(selectedItem.relatedProfession || 0)} onChange={(event) => updateItem({ relatedProfession: Number(event.target.value) })}>
                        {PROFESSION_TYPES.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Material Tier"><input type="number" className={inputClass} value={selectedItem.materialTier} onChange={(event) => updateItem({ materialTier: Number(event.target.value || 1) })} /></Field>
                  </div>
                </SectionCard>
              ) : null}

              {inferItemType(selectedItem) === 'Quest' ? (
                <SectionCard title="Quest Item Data" colorClass="text-violet-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DefinitionPicker label="Related Quest" value={selectedItem.relatedQuestID} onChange={(value) => updateItem({ relatedQuestID: value })} options={hydrated.quests} emptyLabel="Select Quest..." />
                  </div>
                </SectionCard>
              ) : null}
            </>
          ) : <div className="bg-[#162031] rounded-2xl border border-white/5 p-20 text-center text-white/30">No item selected.</div>}
        </section>

        <aside className="bg-[#162031] rounded-2xl border border-white/5 p-5 h-fit sticky top-28">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Global Issues Found</p>
              <h4 className="text-lg font-black text-white mt-1">({issues.length})</h4>
            </div>
          </div>

          {issues.length === 0 ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200 flex gap-3">
              <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
              <span>All data is valid. The system is ready to save.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div key={`${issue.text}-${index}`} className={`rounded-2xl p-4 border ${issue.level === 'error' ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-amber-400/20 bg-amber-400/10 text-amber-100'}`}>
                  <div className="flex gap-3">
                    {issue.level === 'error' ? <AlertTriangle className="shrink-0 mt-0.5" size={18} /> : <ShieldAlert className="shrink-0 mt-0.5" size={18} />}
                    <span className="text-sm leading-relaxed">{issue.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedItem ? (
            <div className="mt-5 pt-5 border-t border-white/5 space-y-3 text-sm text-white/50">
              <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Class Type</span><p className="mt-1 text-white">{inferItemClassType(selectedItem)}</p></div>
              <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Item Type</span><p className="mt-1 text-white">{inferItemType(selectedItem)}</p></div>
              <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Rarity</span><p className="mt-1 text-white">{optionLabel(ITEM_RARITIES, Number(selectedItem.rarity || 0), 'Common')}</p></div>
              {inferItemType(selectedItem) === 'Equipment' ? <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Slot</span><p className="mt-1 text-white">{optionLabel(EQUIPMENT_SLOTS, Number(selectedItem.equipmentSlot ?? -1), 'None')}</p></div> : null}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
