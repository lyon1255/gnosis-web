import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Box, CheckCircle2, ChevronDown, ChevronRight, CloudDownload, CloudUpload, Copy, Database, History, RefreshCw, ScrollText, Settings2, Sparkles, Users, Wand2 } from 'lucide-react';
import QuestEditorPage from './QuestEditorPage';
import ItemEditorPage from './ItemEditorPage';
import {
  buildSyncPayload,
  createDefaultGameData,
  loadCachedGameData,
  loadSyncSettings,
  parseGameDataSource,
  pullGameDataFromApi,
  pushGameDataToApi,
  saveCachedGameData,
  saveSyncSettings,
} from './gameDataSync';

const tabs = [
  { key: 'items', label: 'Items', icon: Box },
  { key: 'auras', label: 'Auras', icon: Sparkles },
  { key: 'entities', label: 'Entities', icon: Users },
  { key: 'quests', label: 'Quests', icon: ScrollText },
  { key: 'spells', label: 'Spells', icon: Wand2 },
  { key: 'versions', label: 'Sync', icon: History },
];

function Placeholder({ label }) {
  return (
    <div className="bg-[#162031] rounded-2xl border border-white/5 p-10 text-center text-white/35">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4] mb-4">Next Step</p>
      <h3 className="text-2xl font-montserrat font-black text-white mb-3">{label}</h3>
      <p>This module shell is ready. Items and Quests are now the main mirrored Unity-to-web surfaces.</p>
    </div>
  );
}

function SyncPanel({ syncSettings, onSyncSettingsChange, gameData, syncState, onPull, onPush, onResetLocal, onImportLocal, onCopyLocal }) {
  const totalRecords = gameData.items.length + gameData.entities.length + gameData.quests.length + gameData.spells.length + gameData.auras.length;
  const syncPayloadPreview = useMemo(() => buildSyncPayload(gameData), [gameData]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
      <div className="space-y-6">
        <div className="bg-[#162031] rounded-2xl border border-white/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Auth API Sync</p>
              <h3 className="text-2xl font-montserrat font-black text-white mt-2">PULL / PUSH Workspace</h3>
              <p className="text-sm text-white/45 mt-3 max-w-2xl">The browser workspace now mirrors the Unity sync DTO shape. Local cache, copy, and import use the assetId / classType / jsonData payload while the editor keeps a hydrated in-memory view.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={onPull} disabled={syncState.loading} className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-50"><CloudDownload size={14} /> Pull</button>
              <button onClick={onPush} disabled={syncState.loading} className="px-4 py-3 rounded-xl bg-[#2EF2C4] text-[#0E1624] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-50"><CloudUpload size={14} /> Push</button>
              <button onClick={onResetLocal} disabled={syncState.loading} className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-50"><RefreshCw size={14} /> Reset Cache</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Auth API Base URL</label>
              <input className="w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" value={syncSettings.apiBaseUrl} onChange={(event) => onSyncSettingsChange({ apiBaseUrl: event.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Admin API Secret</label>
              <input type="password" className="w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" value={syncSettings.adminApiKey} onChange={(event) => onSyncSettingsChange({ adminApiKey: event.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Download Path</label>
              <input className="w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" value={syncSettings.downloadPath} onChange={(event) => onSyncSettingsChange({ downloadPath: event.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Upload Path</label>
              <input className="w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" value={syncSettings.uploadPath} onChange={(event) => onSyncSettingsChange({ uploadPath: event.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Request Timeout (sec)</label>
              <input type="number" className="w-full bg-[#0E1624] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2EF2C4]" value={syncSettings.requestTimeoutSeconds} onChange={(event) => onSyncSettingsChange({ requestTimeoutSeconds: Number(event.target.value || 60) })} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">Header Strategy</label>
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1624] px-4 py-3 text-sm text-white cursor-pointer">
                <span>{syncSettings.useAdminHmac ? 'Use Admin HMAC' : 'Use Plain Admin Key'}</span>
                <input type="checkbox" checked={Boolean(syncSettings.useAdminHmac)} onChange={(event) => onSyncSettingsChange({ useAdminHmac: event.target.checked })} className="w-4 h-4 accent-[#2EF2C4]" />
              </label>
            </div>
          </div>

          {syncState.message ? (
            <div className={`mt-6 rounded-2xl p-4 border ${syncState.level === 'error' ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}>
              <div className="flex gap-3">
                {syncState.level === 'error' ? <AlertTriangle className="shrink-0 mt-0.5" size={18} /> : <CheckCircle2 className="shrink-0 mt-0.5" size={18} />}
                <span className="text-sm leading-relaxed">{syncState.message}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-[#162031] rounded-2xl border border-white/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4]">Local Cache JSON</p>
              <h3 className="text-xl font-montserrat font-black text-white mt-2">Unity Sync Payload Preview</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={onCopyLocal} className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Copy size={14} /> Copy Sync JSON</button>
              <button onClick={onImportLocal} className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Database size={14} /> Import Sync JSON</button>
            </div>
          </div>
          <pre className="bg-[#0E1624] border border-white/10 rounded-2xl p-4 text-[11px] leading-6 text-white/70 overflow-auto max-h-[400px]">{JSON.stringify(syncPayloadPreview, null, 2)}</pre>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-[#162031] rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Workspace Totals</p>
          <h4 className="text-3xl font-montserrat font-black text-white mt-2">{totalRecords}</h4>
          <div className="mt-5 space-y-3 text-sm text-white/55">
            <div className="flex items-center justify-between"><span>Items</span><span className="text-white">{gameData.items.length}</span></div>
            <div className="flex items-center justify-between"><span>Entities</span><span className="text-white">{gameData.entities.length}</span></div>
            <div className="flex items-center justify-between"><span>Quests</span><span className="text-white">{gameData.quests.length}</span></div>
            <div className="flex items-center justify-between"><span>Spells</span><span className="text-white">{gameData.spells.length}</span></div>
            <div className="flex items-center justify-between"><span>Auras</span><span className="text-white">{gameData.auras.length}</span></div>
          </div>
        </div>

        <div className="bg-[#162031] rounded-2xl border border-white/5 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Expected Payload Shape</p>
          <div className="mt-4 space-y-3 text-sm text-white/55">
            <p>1. Top-level items, entities, quests, spells, and auras arrays.</p>
            <p>2. Each entry should contain assetId, classType, and jsonData.</p>
            <p>3. jsonData should contain the Unity MonoBehaviour wrapper string.</p>
            <p>4. PUSH still wraps this payload into the replace request DTO expected by Auth API.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function GameDataWorkspace({ userRole }) {
  const [tab, setTab] = useState('quests');
  const [gameData, setGameData] = useState(() => parseGameDataSource(loadCachedGameData()));
  const [syncSettings, setSyncSettings] = useState(() => loadSyncSettings());
  const [syncState, setSyncState] = useState({ loading: false, level: 'success', message: '' });
  const [syncPanelOpen, setSyncPanelOpen] = useState(true);

  useEffect(() => {
    saveCachedGameData(gameData);
  }, [gameData]);

  useEffect(() => {
    saveSyncSettings(syncSettings);
  }, [syncSettings]);

  const canEditGameData = ['owner', 'publisher'].includes(String(userRole || '').toLowerCase());
  const summaryCounts = useMemo(() => ({
    items: gameData.items.length,
    entities: gameData.entities.length,
    quests: gameData.quests.length,
  }), [gameData]);

  const handlePull = async () => {
    if (!canEditGameData) return;
    setSyncState({ loading: true, level: 'success', message: 'Pulling latest snapshot from the Auth API...' });

    try {
      const pulled = await pullGameDataFromApi(syncSettings);
      setGameData(parseGameDataSource(pulled));
      setSyncState({ loading: false, level: 'success', message: 'Pull completed. Local cache now follows the Unity sync payload format.' });
    } catch (error) {
      setSyncState({ loading: false, level: 'error', message: error?.message || 'Pull failed.' });
    }
  };

  const handlePush = async () => {
    if (!canEditGameData) return;
    setSyncState({ loading: true, level: 'success', message: 'Uploading local cache to the Auth API...' });

    try {
      await pushGameDataToApi(gameData, syncSettings);
      setSyncState({ loading: false, level: 'success', message: 'Push completed. Auth API snapshot replaced successfully.' });
    } catch (error) {
      setSyncState({ loading: false, level: 'error', message: error?.message || 'Push failed.' });
    }
  };

  const handleResetLocal = () => {
    const confirmed = window.confirm('Reset the local workspace cache back to the built-in defaults?');
    if (!confirmed) return;

    setGameData(parseGameDataSource(createDefaultGameData()));
    setSyncState({ loading: false, level: 'success', message: 'Local cache reset to default bundled data.' });
  };

  const handleImportLocal = () => {
    const pasted = window.prompt('Paste a valid sync JSON payload. It should include items, entities, quests, spells, and auras, and each record should use assetId, classType, and jsonData.');
    if (!pasted) return;

    try {
      setGameData(parseGameDataSource(JSON.parse(pasted)));
      setSyncState({ loading: false, level: 'success', message: 'Local cache imported successfully.' });
    } catch {
      setSyncState({ loading: false, level: 'error', message: 'Import failed. The provided text was not valid JSON.' });
    }
  };

  const handleCopyLocal = async () => {
    const payload = JSON.stringify(buildSyncPayload(gameData), null, 2);
    await navigator.clipboard.writeText(payload);
    setSyncState({ loading: false, level: 'success', message: 'Sync JSON copied to the clipboard.' });
  };

  if (!canEditGameData) {
    return (
      <div className="bg-[#162031] rounded-2xl border border-white/5 p-10 text-center text-white/35">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#2EF2C4] mb-4">Game Data Access</p>
        <h3 className="text-2xl font-montserrat font-black text-white mb-3">Restricted Workspace</h3>
        <p>Only Owner and Publisher roles can open and modify the Game Data workspace.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#162031] rounded-2xl border border-white/5 p-3 flex flex-wrap items-center gap-2">
        {tabs.map((entry) => {
          const Icon = entry.icon;
          const active = entry.key === tab;
          return (
            <button key={entry.key} onClick={() => setTab(entry.key)} className={`px-4 py-3 rounded-xl text-sm font-black flex items-center gap-2 transition-all ${active ? 'bg-[#7A3CFF] text-white shadow-xl shadow-[#7A3CFF]/20' : 'bg-transparent text-white/45 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={16} /> {entry.label}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          <span>Items {summaryCounts.items}</span>
          <span>Entities {summaryCounts.entities}</span>
          <span>Quests {summaryCounts.quests}</span>
        </div>
      </div>

      <div className="bg-[#162031] rounded-2xl border border-white/5 overflow-hidden">
        <button onClick={() => setSyncPanelOpen((value) => !value)} className="w-full flex items-center justify-between px-5 py-4 text-left border-b border-white/5 bg-white/[0.02]">
          <span className="text-sm font-black tracking-wide text-cyan-300 flex items-center gap-2"><Settings2 size={16} /> Sync, Local Cache, and API Controls</span>
          {syncPanelOpen ? <ChevronDown size={18} className="text-white/35" /> : <ChevronRight size={18} className="text-white/35" />}
        </button>
        {syncPanelOpen ? <div className="p-5 md:p-6"><SyncPanel syncSettings={syncSettings} onSyncSettingsChange={(patch) => setSyncSettings((current) => ({ ...current, ...patch }))} gameData={gameData} syncState={syncState} onPull={handlePull} onPush={handlePush} onResetLocal={handleResetLocal} onImportLocal={handleImportLocal} onCopyLocal={handleCopyLocal} /></div> : null}
      </div>

      {tab === 'quests' ? <QuestEditorPage data={gameData} onDataChange={setGameData} /> : null}
      {tab === 'items' ? <ItemEditorPage data={gameData} onDataChange={setGameData} /> : null}
      {tab === 'versions' ? <SyncPanel syncSettings={syncSettings} onSyncSettingsChange={(patch) => setSyncSettings((current) => ({ ...current, ...patch }))} gameData={gameData} syncState={syncState} onPull={handlePull} onPush={handlePush} onResetLocal={handleResetLocal} onImportLocal={handleImportLocal} onCopyLocal={handleCopyLocal} /> : null}
      {tab !== 'quests' && tab !== 'items' && tab !== 'versions' ? <Placeholder label={tabs.find((entry) => entry.key === tab)?.label || 'Module'} /> : null}
    </div>
  );
}
