import { rawGameData } from '../../data/gameDataMock';

export const GAME_DATA_CACHE_KEY = 'gnosis_game_data_cache_v3';
export const GAME_DATA_SYNC_SETTINGS_KEY = 'gnosis_game_data_sync_settings_v2';
export const CLASS_ALL_MASK = 31;

export const DEFAULT_SYNC_SETTINGS = {
  apiBaseUrl: 'https://auth.playgnosis.hu',
  downloadPath: '/api/admin/gamedata/snapshot',
  uploadPath: '/api/admin/gamedata/replace',
  adminApiKey: '',
  useAdminHmac: true,
  requestTimeoutSeconds: 60,
};

const structuredCloneSafe = (value) => JSON.parse(JSON.stringify(value));

export function createDefaultGameData() {
  return normalizeGameData(structuredCloneSafe({
    items: rawGameData.items || [],
    entities: rawGameData.entities || [],
    quests: rawGameData.quests || [],
    spells: rawGameData.spells || [],
    auras: rawGameData.auras || [],
  }));
}

export function normalizeGameData(source) {
  return {
    items: Array.isArray(source?.items) ? source.items : [],
    entities: Array.isArray(source?.entities) ? source.entities : [],
    quests: Array.isArray(source?.quests) ? source.quests : [],
    spells: Array.isArray(source?.spells) ? source.spells : [],
    auras: Array.isArray(source?.auras) ? source.auras : [],
  };
}

export function loadCachedGameData() {
  try {
    const raw = window.localStorage.getItem(GAME_DATA_CACHE_KEY);
    if (!raw) return createDefaultGameData();
    return normalizeGameData(JSON.parse(raw));
  } catch {
    return createDefaultGameData();
  }
}

export function saveCachedGameData(data) {
  window.localStorage.setItem(GAME_DATA_CACHE_KEY, JSON.stringify(normalizeGameData(data)));
}

export function loadSyncSettings() {
  try {
    const raw = window.localStorage.getItem(GAME_DATA_SYNC_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SYNC_SETTINGS };
    return { ...DEFAULT_SYNC_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SYNC_SETTINGS };
  }
}

export function saveSyncSettings(settings) {
  window.localStorage.setItem(GAME_DATA_SYNC_SETTINGS_KEY, JSON.stringify({ ...DEFAULT_SYNC_SETTINGS, ...settings }));
}

export function createQuestTemplate() {
  return {
    id: `quest_${Date.now()}`,
    displayName: 'New Quest',
    description: '',
    category: 1,
    questZoneId: 'the_whispering_woodlands',
    canBeAbandoned: true,
    canBeShared: true,
    autoComplete: false,
    minLevel: 1,
    requiredQuestId: '',
    allowedClasses: -1,
    offerDialogue: '',
    progressDialogue: '',
    completionDialogue: '',
    questLogSummary: '',
    goals: [{ type: 0, targetId: '', requiredAmount: 1 }],
    questGiverId: '',
    turnInNpcId: '',
    expReward: 0,
    currencyReward: 0,
    guaranteedItemRewards: [],
    choiceItemRewards: [],
    nextQuestId: '',
    classType: 'QuestDefinition',
  };
}

export function createItemTemplate() {
  return {
    id: `item_${Date.now()}`,
    displayName: 'New Item',
    description: '',
    classType: 'SimpleItem',
    itemType: 'Trash',
    rarity: 0,
    buyPrice: 0,
    sellPrice: 0,
    isTradable: true,
    isSellable: true,
    isDroppable: true,
    isUsableInCombat: false,
    requiredLevel: 1,
    maxStack: 1,
    cooldownDuration: 0,
    abilityHasteAffectsCooldown: false,
    bindType: 0,
    isUnique: false,
    equipmentSlot: -1,
    isTwoHanded: false,
    weaponType: 0,
    armorType: 0,
    statModifiersFlat: createEmptyStatSheet(),
    statModifiersPercent: createEmptyStatSheet(),
    maxDurability: 100,
    healthRestore: 0,
    manaRestore: 0,
    grantedAuraId: '',
    auraLevel: 0,
    relatedProfession: 0,
    materialTier: 1,
    relatedQuestID: '',
  };
}

export function createEmptyStatSheet() {
  return {
    BasicAttack: { x: 0, y: 0 },
    AD: 0,
    AP: 0,
    AttackSpeed: 0,
    CritChance: 0,
    MaxHealth: 0,
    Defense: 0,
    MaxMana: 0,
    AbilityHaste: 0,
    MoveSpeed: 0,
  };
}

export function inferItemClassType(item) {
  if (item.classType) return item.classType;
  switch (item.itemType) {
    case 'Equipment': return 'EquipmentItem';
    case 'Consumable': return 'ConsumableItem';
    case 'Material': return 'MaterialItem';
    case 'Quest': return 'QuestItem';
    default: return 'SimpleItem';
  }
}

export function inferItemType(item) {
  if (item.itemType) return item.itemType;
  switch (item.classType) {
    case 'EquipmentItem': return 'Equipment';
    case 'ConsumableItem': return 'Consumable';
    case 'MaterialItem': return 'Material';
    case 'QuestItem': return 'Quest';
    default: return 'Trash';
  }
}

export function hydrateGameData(data) {
  const normalized = normalizeGameData(data);
  return {
    ...normalized,
    items: normalized.items.map((item) => ({
      ...createItemTemplate(),
      ...item,
      itemType: inferItemType(item),
      classType: inferItemClassType(item),
      statModifiersFlat: { ...createEmptyStatSheet(), ...(item.statModifiersFlat || {}) },
      statModifiersPercent: { ...createEmptyStatSheet(), ...(item.statModifiersPercent || {}) },
      BasicAttack: undefined,
    })),
    quests: normalized.quests.map((quest) => ({ ...createQuestTemplate(), ...quest, classType: 'QuestDefinition' })),
  };
}

function unwrapMonoBehaviour(jsonData) {
  if (!jsonData) return {};
  try {
    const parsed = JSON.parse(jsonData);
    return parsed?.MonoBehaviour || parsed || {};
  } catch {
    return {};
  }
}

function normalizeEntryPayload(section, payload, entry) {
  if (section === 'items') {
    const next = { ...createItemTemplate(), ...payload };
    next.id = next.id || entry.AssetId || entry.assetId || '';
    next.displayName = next.displayName || next.name || entry.AssetId || entry.assetId || '';
    next.classType = entry.ClassType || entry.classType || inferItemClassType(next);
    next.itemType = inferItemType(next);
    next.statModifiersFlat = { ...createEmptyStatSheet(), ...(payload?.statModifiersFlat || {}) };
    next.statModifiersPercent = { ...createEmptyStatSheet(), ...(payload?.statModifiersPercent || {}) };
    return next;
  }

  if (section === 'quests') {
    return { ...createQuestTemplate(), ...payload, id: payload.id || entry.AssetId || entry.assetId || '', classType: 'QuestDefinition' };
  }

  return {
    ...(payload || {}),
    id: payload?.id || entry.AssetId || entry.assetId || '',
    displayName: payload?.displayName || entry.AssetId || entry.assetId || '',
    classType: entry.ClassType || entry.classType || payload?.classType || '',
  };
}

export function adaptSnapshotToGameData(snapshot) {
  const convertSection = (entries, section) => {
    if (!Array.isArray(entries)) return [];
    return entries
      .filter((entry) => entry?.IsEnabled !== false)
      .map((entry) => normalizeEntryPayload(section, unwrapMonoBehaviour(entry.JsonData || entry.jsonData), entry));
  };

  return hydrateGameData({
    items: convertSection(snapshot?.Items || snapshot?.items, 'items'),
    entities: convertSection(snapshot?.Entities || snapshot?.entities, 'entities'),
    quests: convertSection(snapshot?.Quests || snapshot?.quests, 'quests'),
    spells: convertSection(snapshot?.Spells || snapshot?.spells, 'spells'),
    auras: convertSection(snapshot?.Auras || snapshot?.auras, 'auras'),
  });
}

function itemTypeNumber(item) {
  switch (inferItemType(item)) {
    case 'Equipment': return 0;
    case 'Consumable': return 1;
    case 'Material': return 2;
    case 'Quest': return 3;
    case 'Trash': return 4;
    default: return 5;
  }
}

function buildItemMonoBehaviour(item) {
  return {
    ...item,
    m_Name: item.id,
    m_EditorClassIdentifier: `Assembly-CSharp::${inferItemClassType(item)}`,
    id: item.id,
    displayName: item.displayName,
    description: item.description,
    rarity: Number(item.rarity || 0),
    buyPrice: Number(item.buyPrice || 0),
    sellPrice: Number(item.sellPrice || 0),
    isTradable: Boolean(item.isTradable),
    isSellable: Boolean(item.isSellable),
    isDroppable: Boolean(item.isDroppable),
    isUsableInCombat: Boolean(item.isUsableInCombat),
    requiredLevel: Number(item.requiredLevel || 1),
    maxStack: Number(item.maxStack || 1),
    cooldownDuration: Number(item.cooldownDuration || 0),
    abilityHasteAffectsCooldown: Boolean(item.abilityHasteAffectsCooldown),
    bindType: Number(item.bindType || 0),
    isUnique: Boolean(item.isUnique),
    itemType: itemTypeNumber(item),
    equipmentSlot: Number(item.equipmentSlot ?? -1),
    isTwoHanded: Boolean(item.isTwoHanded),
    weaponType: Number(item.weaponType || 0),
    armorType: Number(item.armorType || 0),
    statModifiersFlat: item.statModifiersFlat || createEmptyStatSheet(),
    statModifiersPercent: item.statModifiersPercent || createEmptyStatSheet(),
    maxDurability: Number(item.maxDurability || 0),
    healthRestore: Number(item.healthRestore || 0),
    manaRestore: Number(item.manaRestore || 0),
    grantedAuraId: item.grantedAuraId || '',
    auraLevel: Number(item.auraLevel || 0),
    relatedProfession: Number(item.relatedProfession || 0),
    materialTier: Number(item.materialTier || 1),
    relatedQuestID: item.relatedQuestID || '',
  };
}

function buildQuestMonoBehaviour(quest) {
  return {
    ...quest,
    m_Name: quest.id,
    m_EditorClassIdentifier: 'Assembly-CSharp::QuestDefinition',
    id: quest.id,
    displayName: quest.displayName,
    description: quest.description,
    category: Number(quest.category || 0),
    questZoneId: quest.questZoneId || '',
    canBeAbandoned: Boolean(quest.canBeAbandoned),
    canBeShared: Boolean(quest.canBeShared),
    autoComplete: Boolean(quest.autoComplete),
    minLevel: Number(quest.minLevel || 1),
    requiredQuestId: quest.requiredQuestId || '',
    allowedClasses: Number(quest.allowedClasses ?? -1),
    offerDialogue: quest.offerDialogue || '',
    progressDialogue: quest.progressDialogue || '',
    completionDialogue: quest.completionDialogue || '',
    questLogSummary: quest.questLogSummary || '',
    goals: Array.isArray(quest.goals) ? quest.goals.map((goal) => ({
      type: Number(goal.type || 0),
      targetId: goal.targetId || '',
      requiredAmount: Number(goal.requiredAmount || 1),
    })) : [],
    questGiverId: quest.questGiverId || '',
    turnInNpcId: quest.turnInNpcId || '',
    expReward: Number(quest.expReward || 0),
    currencyReward: Number(quest.currencyReward || 0),
    guaranteedItemRewards: Array.isArray(quest.guaranteedItemRewards) ? quest.guaranteedItemRewards.map((reward) => ({ itemId: reward.itemId || '', amount: Number(reward.amount || 1) })) : [],
    choiceItemRewards: Array.isArray(quest.choiceItemRewards) ? quest.choiceItemRewards.map((reward) => ({ itemId: reward.itemId || '', amount: Number(reward.amount || 1) })) : [],
    nextQuestId: quest.nextQuestId || '',
  };
}

function buildGenericMonoBehaviour(record, classType) {
  return {
    m_Name: record.id || record.assetId || record.displayName || '',
    m_EditorClassIdentifier: `Assembly-CSharp::${classType}`,
    ...record,
  };
}

function toEntry(record, section) {
  const classType = record.classType || inferItemClassType(record);
  const monoBehaviour = section === 'items'
    ? buildItemMonoBehaviour(record)
    : section === 'quests'
      ? buildQuestMonoBehaviour(record)
      : buildGenericMonoBehaviour(record, classType);

  return {
    AssetId: record.id,
    ClassType: section === 'items' ? inferItemClassType(record) : classType,
    JsonData: JSON.stringify({ MonoBehaviour: monoBehaviour }),
    IsEnabled: true,
  };
}

export function buildReplaceRequest(data) {
  const normalized = hydrateGameData(data);
  return {
    VersionTag: `web-${new Date().toISOString().replace(/[:.]/g, '-')}`,
    Notes: 'Web GameDataWorkspace upload',
    Items: normalized.items.map((item) => toEntry(item, 'items')),
    Entities: normalized.entities.map((entity) => toEntry(entity, 'entities')),
    Quests: normalized.quests.map((quest) => toEntry(quest, 'quests')),
    Spells: normalized.spells.map((spell) => toEntry(spell, 'spells')),
    Auras: normalized.auras.map((aura) => toEntry(aura, 'auras')),
  };
}

function joinUrl(baseUrl, path) {
  return `${String(baseUrl || '').trim().replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

async function sha256Hex(bytes) {
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256Hex(secret, input) {
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await window.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function applyAdminHeaders(method, pathWithOptionalQuery, bodyBytes, settings) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (!settings.adminApiKey) return headers;

  if (!settings.useAdminHmac) {
    headers['X-Gnosis-Admin-Key'] = settings.adminApiKey;
    return headers;
  }

  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  const nonce = window.crypto.randomUUID().replace(/-/g, '');
  const safeBytes = bodyBytes || new Uint8Array();
  const bodySha256 = await sha256Hex(safeBytes);

  const queryIndex = pathWithOptionalQuery.indexOf('?');
  const path = queryIndex >= 0 ? pathWithOptionalQuery.slice(0, queryIndex) : pathWithOptionalQuery;
  const query = queryIndex >= 0 ? pathWithOptionalQuery.slice(queryIndex) : '';

  const canonical = [
    method.toUpperCase(),
    path || '/',
    query,
    timestamp,
    nonce,
    bodySha256,
  ].join('\n');

  const signature = await hmacSha256Hex(settings.adminApiKey, canonical);

  headers['X-Gnosis-Admin-Timestamp'] = timestamp;
  headers['X-Gnosis-Admin-Nonce'] = nonce;
  headers['X-Gnosis-Admin-Signature'] = signature;
  headers['X-Gnosis-Admin-Body-Sha256'] = bodySha256;
  return headers;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const error = new Error((parsed && (parsed.message || parsed.title)) || text || `HTTP ${response.status}`);
    error.status = response.status;
    error.payload = parsed;
    error.raw = text;
    throw error;
  }

  return parsed;
}

export async function pullGameDataFromApi(settings) {
  const path = settings.downloadPath || DEFAULT_SYNC_SETTINGS.downloadPath;
  const url = joinUrl(settings.apiBaseUrl, path);
  const headers = await applyAdminHeaders('GET', path, new Uint8Array(), settings);
  const snapshot = await fetchJson(url, { method: 'GET', headers, signal: AbortSignal.timeout?.(Math.max(1, Number(settings.requestTimeoutSeconds || 60)) * 1000) });
  return adaptSnapshotToGameData(snapshot);
}

export async function pushGameDataToApi(data, settings) {
  const path = settings.uploadPath || DEFAULT_SYNC_SETTINGS.uploadPath;
  const url = joinUrl(settings.apiBaseUrl, path);
  const payload = buildReplaceRequest(data);
  const body = JSON.stringify(payload);
  const bodyBytes = new TextEncoder().encode(body);
  const headers = await applyAdminHeaders('POST', path, bodyBytes, settings);
  return fetchJson(url, {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout?.(Math.max(1, Number(settings.requestTimeoutSeconds || 60)) * 1000),
  });
}
