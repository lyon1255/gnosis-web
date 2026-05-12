import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Plus, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { CLASS_FLAGS, QUEST_CATEGORIES, QUEST_OBJECTIVE_TYPES } from '../../data/gameDataMock';
import { CLASS_ALL_MASK, createQuestTemplate, hydrateGameData } from './gameDataSync';

const inputClass = 'w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]';

const categoryLabel = (value) => QUEST_CATEGORIES.find((entry) => entry.value === value)?.label ?? `Category ${value}`;
const objectiveLabel = (value) => QUEST_OBJECTIVE_TYPES.find((entry) => entry.value === value)?.label ?? `Objective ${value}`;
const findById = (list, id) => list.find((entry) => entry.id === id);
const titleForRef = (list, id) => (findById(list, id)?.displayName ? `${findById(list, id).displayName} (${id})` : id || 'Select Entry...');
const allClassesSelected = (value) => value === -1 || value === CLASS_ALL_MASK;

function decodeAllowedClasses(mask) {
  if (allClassesSelected(mask)) return CLASS_FLAGS.map((entry) => entry.label);
  if (mask === 0) return [];
  return CLASS_FLAGS.filter((entry) => (mask & entry.value) !== 0).map((entry) => entry.label);
}

function encodeAllowedClasses(selected) {
  if (!selected.length) return 0;
  if (selected.length === CLASS_FLAGS.length) return -1;
  return CLASS_FLAGS.filter((entry) => selected.includes(entry.label)).reduce((sum, entry) => sum | entry.value, 0);
}

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

function IdPicker({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <select className={inputClass} value={value || ''} onChange={(event) => onChange(event.target.value)}>
          <option value="">Select Entry...</option>
          {options.map((option) => <option key={option.id} value={option.id}>{option.displayName} ({option.id})</option>)}
        </select>
        {value ? <button type="button" onClick={() => onChange('')} className="px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white">X</button> : null}
      </div>
    </Field>
  );
}

function RewardRow({ reward, items, onChange, onRemove }) {
  return (
    <div className="bg-[#0E1624] border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex gap-2">
        <select className={inputClass} value={reward.itemId} onChange={(event) => onChange({ ...reward, itemId: event.target.value })}>
          <option value="">Select Item...</option>
          {items.map((item) => <option key={item.id} value={item.id}>{item.displayName} ({item.id})</option>)}
        </select>
        <button type="button" onClick={onRemove} className="px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20"><Trash2 size={15} /></button>
      </div>
      <input type="number" className={inputClass} value={reward.amount} onChange={(event) => onChange({ ...reward, amount: Number(event.target.value || 0) })} />
    </div>
  );
}

function ObjectiveRow({ goal, entities, items, onChange, onRemove }) {
  const type = Number(goal.type);
  const isEntityPicker = type === 0 || type === 1;
  const isItemPicker = type === 2 || type === 5;
  const fixedAmount = type === 1 || type === 3;

  return (
    <div className="bg-[#0E1624] border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex gap-2">
        <select className={inputClass} value={goal.type} onChange={(event) => {
          const nextType = Number(event.target.value);
          onChange({ ...goal, type: nextType, requiredAmount: (nextType === 1 || nextType === 3) ? 1 : goal.requiredAmount });
        }}>
          {QUEST_OBJECTIVE_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button type="button" onClick={onRemove} className="px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20"><Trash2 size={15} /></button>
      </div>

      {isEntityPicker ? (
        <select className={inputClass} value={goal.targetId} onChange={(event) => onChange({ ...goal, targetId: event.target.value })}>
          <option value="">Target Entity</option>
          {entities.map((entity) => <option key={entity.id} value={entity.id}>{entity.displayName} ({entity.id})</option>)}
        </select>
      ) : isItemPicker ? (
        <select className={inputClass} value={goal.targetId} onChange={(event) => onChange({ ...goal, targetId: event.target.value })}>
          <option value="">Target Item</option>
          {items.map((item) => <option key={item.id} value={item.id}>{item.displayName} ({item.id})</option>)}
        </select>
      ) : (
        <input className={inputClass} value={goal.targetId} onChange={(event) => onChange({ ...goal, targetId: event.target.value })} placeholder="Target String (ID / Location)" />
      )}

      <input type="number" className={`${inputClass} ${fixedAmount ? 'opacity-60' : ''}`} value={fixedAmount ? 1 : goal.requiredAmount} disabled={fixedAmount} onChange={(event) => onChange({ ...goal, requiredAmount: Number(event.target.value || 0) })} />
    </div>
  );
}

function buildIssues(quest, data) {
  const issues = [];
  const addIssue = (level, text) => issues.push({ level, text });

  if (!quest.displayName?.trim()) addIssue('error', 'Name is missing.');
  if (!quest.id?.trim()) addIssue('error', 'Unique database ID is missing.');
  if (!quest.goals?.length) addIssue('error', 'Quest has no goals.');
  if (!quest.questGiverId) addIssue('error', 'Quest Giver is missing.');
  if (!quest.autoComplete && !quest.turnInNpcId) addIssue('warning', 'Turn-In NPC is empty while auto-complete is disabled.');
  if (quest.autoComplete && quest.turnInNpcId) addIssue('warning', 'Auto-complete quest should not keep a Turn-In NPC.');
  if (quest.autoComplete && quest.completionDialogue) addIssue('warning', 'Auto-complete quest should not keep a completion dialogue.');

  if (quest.requiredQuestId && !findById(data.quests, quest.requiredQuestId)) addIssue('error', `Required quest reference is invalid: ${quest.requiredQuestId}`);
  if (quest.nextQuestId && !findById(data.quests, quest.nextQuestId)) addIssue('error', `Next quest reference is invalid: ${quest.nextQuestId}`);
  if (quest.questGiverId && !findById(data.entities, quest.questGiverId) && !findById(data.items.filter((item) => item.classType === 'QuestItem'), quest.questGiverId)) addIssue('error', `Quest Giver reference is invalid: ${quest.questGiverId}`);
  if (quest.turnInNpcId && !findById(data.entities, quest.turnInNpcId) && !findById(data.items.filter((item) => item.classType === 'QuestItem'), quest.turnInNpcId)) addIssue('error', `Turn-In NPC reference is invalid: ${quest.turnInNpcId}`);

  quest.goals.forEach((goal, index) => {
    const type = Number(goal.type);
    if (type === 0 || type === 1) {
      if (!findById(data.entities, goal.targetId)) addIssue('error', `Goal ${index + 1} has invalid entity target: ${goal.targetId || 'empty'}`);
    } else if (type === 2 || type === 5) {
      if (!findById(data.items, goal.targetId)) addIssue('error', `Goal ${index + 1} has invalid item target: ${goal.targetId || 'empty'}`);
    }
    if ((type === 1 || type === 3) && Number(goal.requiredAmount) !== 1) addIssue('warning', `Goal ${index + 1} should force quantity to 1.`);
  });

  [...quest.guaranteedItemRewards, ...quest.choiceItemRewards].forEach((reward, index) => {
    if (!findById(data.items, reward.itemId)) addIssue('error', `Reward ${index + 1} has invalid item reference: ${reward.itemId || 'empty'}`);
  });

  return issues;
}

export default function QuestEditorPage({ data, onDataChange }) {
  const hydrated = useMemo(() => hydrateGameData(data), [data]);
  const [search, setSearch] = useState('');
  const [selectedQuestId, setSelectedQuestId] = useState(hydrated.quests[0]?.id || '');

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = hydrated.quests.filter((quest) => {
      if (!term) return true;
      return [quest.displayName, quest.id, quest.questZoneId, categoryLabel(quest.category)].some((value) => String(value || '').toLowerCase().includes(term));
    });

    const zones = {};
    filtered.forEach((quest) => {
      const zoneKey = quest.questZoneId || 'ungrouped';
      if (!zones[zoneKey]) zones[zoneKey] = {};
      const categoryKey = categoryLabel(quest.category);
      if (!zones[zoneKey][categoryKey]) zones[zoneKey][categoryKey] = [];
      zones[zoneKey][categoryKey].push(quest);
    });
    return zones;
  }, [hydrated.quests, search]);

  useEffect(() => {
    if (!hydrated.quests.length) {
      setSelectedQuestId('');
      return;
    }
    if (!hydrated.quests.some((quest) => quest.id === selectedQuestId)) {
      setSelectedQuestId(hydrated.quests[0].id);
    }
  }, [hydrated.quests, selectedQuestId]);

  const selectedQuest = hydrated.quests.find((quest) => quest.id === selectedQuestId) || hydrated.quests[0] || null;
  const issues = selectedQuest ? buildIssues(selectedQuest, hydrated) : [];

  const updateQuests = (updater) => {
    onDataChange({ ...hydrated, quests: updater(hydrated.quests) });
  };

  const updateQuest = (patch) => {
    if (!selectedQuest) return;
    updateQuests((quests) => quests.map((quest) => {
      if (quest.id !== selectedQuest.id) return quest;
      const next = { ...quest, ...patch };
      if (patch.displayName !== undefined && patch.id === undefined) {
        next.id = `quest_${String(patch.displayName || '').trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
      }
      if (next.autoComplete) {
        next.turnInNpcId = '';
        next.completionDialogue = '';
      }
      return next;
    }));
  };

  const createQuest = () => {
    const newQuest = createQuestTemplate();
    updateQuests((quests) => [newQuest, ...quests]);
    setSelectedQuestId(newQuest.id);
  };

  const removeSelectedQuest = () => {
    if (!selectedQuest) return;
    const remaining = hydrated.quests.filter((quest) => quest.id !== selectedQuest.id);
    onDataChange({ ...hydrated, quests: remaining });
    setSelectedQuestId(remaining[0]?.id || '');
  };

  const setAllowedClassToggle = (label, checked) => {
    if (!selectedQuest) return;

    if (label === 'All') {
      updateQuest({ allowedClasses: checked ? -1 : 0 });
      return;
    }

    const current = decodeAllowedClasses(selectedQuest.allowedClasses);
    const nextSet = new Set(current);

    if (allClassesSelected(selectedQuest.allowedClasses)) {
      CLASS_FLAGS.forEach((entry) => nextSet.add(entry.label));
    }

    if (checked) nextSet.add(label);
    else nextSet.delete(label);

    updateQuest({ allowedClasses: encodeAllowedClasses(Array.from(nextSet)) });
  };

  const questGiverOptions = [...hydrated.entities, ...hydrated.items.filter((item) => item.classType === 'QuestItem')];

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Game Data / Quests</p>
          <h2 className="text-3xl font-montserrat font-black text-white mt-2">Quest Editor</h2>
          <p className="text-sm text-white/45 mt-3 max-w-3xl">Unity-style quest editing surface for the web. This mirrors the current QuestDefinition inspector layout and keeps changes inside the local cache until PUSH.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={createQuest} className="px-5 py-3 rounded-xl bg-[#2EF2C4] text-[#0E1624] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Plus size={14} /> New Quest</button>
          <button onClick={removeSelectedQuest} className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Trash2 size={14} /> Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_320px] gap-6 min-h-[72vh]">
        <section className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-white/25" size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search quests, IDs, zones..." className="w-full bg-[#0E1624] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" />
            </div>
            <button onClick={createQuest} className="w-full py-3 rounded-xl bg-green-700/80 hover:bg-green-600 text-white text-sm font-black">Create New Quest</button>
          </div>
          <div className="p-3 max-h-[72vh] overflow-y-auto space-y-4">
            {Object.entries(grouped).map(([zone, categories]) => (
              <div key={zone}>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Zone: {zone} ({Object.values(categories).flat().length})</p>
                <div className="space-y-3">
                  {Object.entries(categories).map(([category, zoneQuests]) => (
                    <div key={category}>
                      <p className="text-xs font-black text-white/50 mb-2">{category} ({zoneQuests.length})</p>
                      <div className="space-y-1.5">
                        {zoneQuests.map((quest) => (
                          <button key={quest.id} onClick={() => setSelectedQuestId(quest.id)} className={`w-full text-left px-3 py-3 rounded-xl border ${selectedQuest?.id === quest.id ? 'bg-[#7A3CFF]/20 border-[#7A3CFF]/40 text-white' : 'bg-[#0E1624] border-white/5 text-white/70 hover:border-white/10'}`}>
                            <span className="text-sm font-semibold leading-tight">{quest.displayName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          {selectedQuest ? (
            <>
              <div className="bg-[#162031] rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">Editing</p>
                  <h3 className="text-2xl font-montserrat font-black text-white mt-2">{selectedQuest.displayName}</h3>
                </div>
                <button className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/60 text-xs font-black uppercase tracking-[0.2em]">Frontend Preview Only</button>
              </div>

              <SectionCard title="Logistics & Requirements" colorClass="text-sky-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Display Name">
                    <input className={inputClass} value={selectedQuest.displayName} onChange={(event) => updateQuest({ displayName: event.target.value })} />
                  </Field>
                  <Field label="Unique Database ID">
                    <input className={`${inputClass} opacity-70`} value={selectedQuest.id} readOnly />
                  </Field>
                  <Field label="Description" full>
                    <textarea rows={3} className={`${inputClass} resize-y`} value={selectedQuest.description} onChange={(event) => updateQuest({ description: event.target.value })} />
                  </Field>
                  <Field label="Category">
                    <select className={inputClass} value={selectedQuest.category} onChange={(event) => updateQuest({ category: Number(event.target.value) })}>
                      {QUEST_CATEGORIES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Zone ID (Sorting)">
                    <input className={inputClass} value={selectedQuest.questZoneId} onChange={(event) => updateQuest({ questZoneId: event.target.value })} />
                  </Field>
                  <Field label="Abandonable">
                    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1624] px-4 py-3 text-sm text-white"><span>{selectedQuest.canBeAbandoned ? 'Enabled' : 'Disabled'}</span><input type="checkbox" checked={selectedQuest.canBeAbandoned} onChange={(event) => updateQuest({ canBeAbandoned: event.target.checked })} className="w-4 h-4 accent-[#2EF2C4]" /></label>
                  </Field>
                  <Field label="Shareable">
                    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1624] px-4 py-3 text-sm text-white"><span>{selectedQuest.canBeShared ? 'Enabled' : 'Disabled'}</span><input type="checkbox" checked={selectedQuest.canBeShared} onChange={(event) => updateQuest({ canBeShared: event.target.checked })} className="w-4 h-4 accent-[#2EF2C4]" /></label>
                  </Field>
                  <Field label="Min Level"><input type="number" className={inputClass} value={selectedQuest.minLevel} onChange={(event) => updateQuest({ minLevel: Number(event.target.value || 0) })} /></Field>
                  <Field label="Allowed Classes" full>
                    <div className="rounded-2xl border border-white/10 bg-[#0E1624] p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={allClassesSelected(selectedQuest.allowedClasses)} onChange={(event) => setAllowedClassToggle('All', event.target.checked)} className="w-4 h-4 accent-[#2EF2C4]" />All</label>
                      {CLASS_FLAGS.map((entry) => (
                        <label key={entry.value} className="flex items-center gap-2 text-sm text-white">
                          <input type="checkbox" checked={decodeAllowedClasses(selectedQuest.allowedClasses).includes(entry.label)} onChange={(event) => setAllowedClassToggle(entry.label, event.target.checked)} className="w-4 h-4 accent-[#2EF2C4]" />
                          {entry.label}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <IdPicker label="Required Quest" value={selectedQuest.requiredQuestId} onChange={(value) => updateQuest({ requiredQuestId: value })} options={hydrated.quests.filter((quest) => quest.id !== selectedQuest.id)} />
                  <IdPicker label="Next Quest (Chaining)" value={selectedQuest.nextQuestId} onChange={(value) => updateQuest({ nextQuestId: value })} options={hydrated.quests.filter((quest) => quest.id !== selectedQuest.id)} />
                </div>
              </SectionCard>

              <SectionCard title="NPCs & Narrative" colorClass="text-amber-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IdPicker label="Quest Giver" value={selectedQuest.questGiverId} onChange={(value) => updateQuest({ questGiverId: value })} options={questGiverOptions} />
                  <Field label="Auto-Complete on Finish">
                    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1624] px-4 py-3 text-sm text-white"><span>{selectedQuest.autoComplete ? 'Enabled' : 'Disabled'}</span><input type="checkbox" checked={selectedQuest.autoComplete} onChange={(event) => updateQuest({ autoComplete: event.target.checked })} className="w-4 h-4 accent-[#2EF2C4]" /></label>
                  </Field>
                  {!selectedQuest.autoComplete ? <IdPicker label="Turn-In NPC" value={selectedQuest.turnInNpcId} onChange={(value) => updateQuest({ turnInNpcId: value })} options={questGiverOptions} /> : null}
                  <Field label="Quest Log Summary" full><textarea rows={2} className={`${inputClass} resize-y`} value={selectedQuest.questLogSummary} onChange={(event) => updateQuest({ questLogSummary: event.target.value })} /></Field>
                  <Field label="Offer Dialogue" full><textarea rows={3} className={`${inputClass} resize-y`} value={selectedQuest.offerDialogue} onChange={(event) => updateQuest({ offerDialogue: event.target.value })} /></Field>
                  <Field label="In-Progress Dialogue" full><textarea rows={3} className={`${inputClass} resize-y`} value={selectedQuest.progressDialogue} onChange={(event) => updateQuest({ progressDialogue: event.target.value })} /></Field>
                  {!selectedQuest.autoComplete ? <Field label="Completion Dialogue" full><textarea rows={3} className={`${inputClass} resize-y`} value={selectedQuest.completionDialogue} onChange={(event) => updateQuest({ completionDialogue: event.target.value })} /></Field> : null}
                </div>
              </SectionCard>

              <SectionCard title="Quest Objectives" colorClass="text-rose-300">
                <div className="space-y-3">
                  {selectedQuest.goals.map((goal, index) => (
                    <ObjectiveRow key={`${selectedQuest.id}-goal-${index}`} goal={goal} entities={hydrated.entities} items={hydrated.items} onChange={(nextGoal) => updateQuest({ goals: selectedQuest.goals.map((entry, goalIndex) => goalIndex === index ? nextGoal : entry) })} onRemove={() => updateQuest({ goals: selectedQuest.goals.filter((_, goalIndex) => goalIndex !== index) })} />
                  ))}
                  <button onClick={() => updateQuest({ goals: [...selectedQuest.goals, { type: 0, targetId: '', requiredAmount: 1 }] })} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold">+ Add Objective</button>
                </div>
              </SectionCard>

              <SectionCard title="Quest Rewards" colorClass="text-amber-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <Field label="XP Reward"><input type="number" className={inputClass} value={selectedQuest.expReward} onChange={(event) => updateQuest({ expReward: Number(event.target.value || 0) })} /></Field>
                  <Field label="Money Reward"><input type="number" className={inputClass} value={selectedQuest.currencyReward} onChange={(event) => updateQuest({ currencyReward: Number(event.target.value || 0) })} /></Field>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35 mb-3">Guaranteed Item Rewards</p>
                    <div className="space-y-3">
                      {selectedQuest.guaranteedItemRewards.map((reward, index) => <RewardRow key={`g-${index}`} reward={reward} items={hydrated.items} onChange={(nextReward) => updateQuest({ guaranteedItemRewards: selectedQuest.guaranteedItemRewards.map((entry, rewardIndex) => rewardIndex === index ? nextReward : entry) })} onRemove={() => updateQuest({ guaranteedItemRewards: selectedQuest.guaranteedItemRewards.filter((_, rewardIndex) => rewardIndex !== index) })} />)}
                      <button onClick={() => updateQuest({ guaranteedItemRewards: [...selectedQuest.guaranteedItemRewards, { itemId: '', amount: 1 }] })} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold">+ Add Guaranteed Reward</button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35 mb-3">Choice Item Rewards (Pick One)</p>
                    <div className="space-y-3">
                      {selectedQuest.choiceItemRewards.map((reward, index) => <RewardRow key={`c-${index}`} reward={reward} items={hydrated.items} onChange={(nextReward) => updateQuest({ choiceItemRewards: selectedQuest.choiceItemRewards.map((entry, rewardIndex) => rewardIndex === index ? nextReward : entry) })} onRemove={() => updateQuest({ choiceItemRewards: selectedQuest.choiceItemRewards.filter((_, rewardIndex) => rewardIndex !== index) })} />)}
                      <button onClick={() => updateQuest({ choiceItemRewards: [...selectedQuest.choiceItemRewards, { itemId: '', amount: 1 }] })} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold">+ Add Choice Reward</button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </>
          ) : <div className="bg-[#162031] rounded-2xl border border-white/5 p-20 text-center text-white/30">No quest selected.</div>}
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

          {selectedQuest ? (
            <div className="mt-5 pt-5 border-t border-white/5 space-y-3 text-sm text-white/50">
              <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Quest Giver</span><p className="mt-1 text-white">{titleForRef(questGiverOptions, selectedQuest.questGiverId)}</p></div>
              <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Allowed Classes</span><p className="mt-1 text-white">{decodeAllowedClasses(selectedQuest.allowedClasses).length ? decodeAllowedClasses(selectedQuest.allowedClasses).join(', ') : 'None'}</p></div>
              <div><span className="text-white/25 uppercase text-[10px] font-black tracking-[0.22em]">Objectives</span><p className="mt-1 text-white">{selectedQuest.goals.map((goal) => `${objectiveLabel(goal.type)}: ${goal.targetId}`).join(' | ')}</p></div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
