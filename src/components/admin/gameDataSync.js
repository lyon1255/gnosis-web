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

const SYNC_SECTIONS = ['items', 'entities', 'quests', 'spells', 'auras'];

const structuredCloneSafe = (value) => JSON.parse(JSON.stringify(value));

const createEmptySyncPayload = () => ({
  items: [],
  entities: [],
  quests: [],
  spells: [],
  auras: [],
});

function getRawGameDataSource() {
  return structuredCloneSafe({
    items: rawGameData.items || [],
    entities: rawGameData.entities || [],
    quests: rawGameData.quests || [],
    spells: rawGameData.spells || [],
    auras: rawGameData.auras || [],
  });
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

function looksLikeSyncEntry(entry) {
  return Boolean(entry) && typeof entry === 'object' && (
    Object.prototype.hasOwnProperty.call(entry, 'assetId')
    || Object.prototype.hasOwnProperty.call(entry, 'AssetId')
    || Object.prototype.hasOwnProperty.call(entry, 'jsonData')
    || Object.prototype.hasOwnProperty.call(entry, 'JsonData')
  );
}

function looksLikeSyncSection(entries) {
  return Array.isArray(entries) && entries.some((entry) => looksLikeSyncEntry(entry));
}

function looksLikeSyncSource(source) {
  return looksLikeSyncSection(source?.items)
    || looksLikeSyncSection(source?.entities)
    || looksLikeSyncSection(source?.quests)
    || looksLikeSyncSection(source?.spells)
    || looksLikeSyncSection(source?.auras)
    || Array.isArray(source?.Items)
    || Array.isArray(source?.Entities)
    || Array.isArray(source?.Quests)
    || Array.isArray(source?.Spells)
    || Array.isArray(source?.Auras);
}

function unwrapMonoBehaviour(jsonData) {
  if (!jsonData) return {};
  if (typeof jsonData === 'object') {
    return jsonData?.MonoBehaviour || jsonData;
  }

  try {
    const parsed = JSON.parse(jsonData);
    return parsed?.MonoBehaviour || parsed || {};
  } catch {
    return {};
  }
}

function normalizeSyncEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;

  const assetId = entry.assetId || entry.AssetId || entry.id || '';
  const classType = entry.classType || entry.ClassType || entry.type || '';
  const jsonSource = entry.jsonData ?? entry.JsonData ?? null;
  const isEnabled = entry.isEnabled ?? entry.IsEnabled ?? true;

  let jsonData = '';
  if (typeof jsonSource === 'string') {
    jsonData = jsonSource;
  } else if (jsonSource && typeof jsonSource === 'object') {
    jsonData = JSON.stringify(jsonSource);
  }

  return {
    assetId,
    classType,
    jsonData,
    isEnabled,
  };
}

function normalizeSyncPayload(source) {
  const normalized = createEmptySyncPayload();

  for (const section of SYNC_SECTIONS) {
    const pascalKey = section.charAt(0).toUpperCase() + section.slice(1);
    const rawEntries = Array.isArray(source?.[pascalKey])
      ? source[pascalKey]
      : Array.isArray(source?.[section])
        ? source[section]
        : [];

    normalized[section] = rawEntries
      .map((entry) => normalizeSyncEntry(entry))
      .filter(Boolean);
  }

  return normalized;
}

function normalizeEntryPayload(section, payload, entry) {
  if (section === 'items') {
    const next = { ...createItemTemplate(), ...payload };
    next.id = next.id || entry.assetId || '';
    next.displayName = next.displayName || next.name || entry.assetId || '';
    next.classType = entry.classType || inferItemClassType(next);
    next.itemType = inferItemType(next);
    next.statModifiersFlat = { ...createEmptyStatSheet(), ...(payload?.statModifiersFlat || {}) };
    next.statModifiersPercent = { ...createEmptyStatSheet(), ...(payload?.statModifiersPercent || {}) };
    return next;
  }

  if (section === 'quests') {
    return {
      ...createQuestTemplate(),
      ...payload,
      id: payload?.id || entry.assetId || '',
      classType: entry.classType || payload?.classType || 'QuestDefinition',
    };
  }

  return {
    ...(payload || {}),
    id: payload?.id || entry.assetId || '',
    displayName: payload?.displayName || entry.assetId || '',
    classType: entry.classType || payload?.classType || '',
  };
}

export function adaptSnapshotToGameData(snapshot) {
  const normalizedSync = normalizeSyncPayload(snapshot);

  const convertSection = (entries, section) => entries
    .filter((entry) => entry.isEnabled !== false)
    .map((entry) => normalizeEntryPayload(section, unwrapMonoBehaviour(entry.jsonData), entry));

  return hydrateGameData({
    items: convertSection(normalizedSync.items, 'items'),
    entities: convertSection(normalizedSync.entities, 'entities'),
    quests: convertSection(normalizedSync.quests, 'quests'),
    spells: convertSection(normalizedSync.spells, 'spells'),
    auras: convertSection(normalizedSync.auras, 'auras'),
  });
}

export function parseGameDataSource(source) {
  if (looksLikeSyncSource(source)) {
    return adaptSnapshotToGameData(source);
  }

  return hydrateGameData(normalizeGameData(source));
}

export function createDefaultGameData() {
  return parseGameDataSource(getRawGameDataSource());
}

export function loadCachedGameData() {
  try {
    const raw = window.localStorage.getItem(GAME_DATA_CACHE_KEY);
    if (!raw) return createDefaultGameData();
    return parseGameDataSource(JSON.parse(raw));
  } catch {
    return createDefaultGameData();
  }
}

export function saveCachedGameData(data) {
  window.localStorage.setItem(GAME_DATA_CACHE_KEY, JSON.stringify(buildSyncPayload(data)));
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
    guaranteedItemRewards: Array.isArray(quest.guaranteedItemRewards)
      ? quest.guaranteedItemRewards.map((reward) => ({ itemId: reward.itemId || '', amount: Number(reward.amount || 1) }))
      : [],
    choiceItemRewards: Array.isArray(quest.choiceItemRewards)
      ? quest.choiceItemRewards.map((reward) => ({ itemId: reward.itemId || '', amount: Number(reward.amount || 1) }))
      : [],
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

function createSyncEntry(record, section) {
  const classType = section === 'items'
    ? inferItemClassType(record)
    : (record.classType || (section === 'quests' ? 'QuestDefinition' : ''));

  const monoBehaviour = section === 'items'
    ? buildItemMonoBehaviour(record)
    : section === 'quests'
      ? buildQuestMonoBehaviour(record)
      : buildGenericMonoBehaviour(record, classType);

  return {
    assetId: record.id || record.assetId || '',
    classType,
    jsonData: JSON.stringify({ MonoBehaviour: monoBehaviour }),
  };
}

export function buildSyncPayload(data) {
  const normalized = hydrateGameData(normalizeGameData(data));

  return {
    items: normalized.items.map((item) => createSyncEntry(item, 'items')),
    entities: normalized.entities.map((entity) => createSyncEntry(entity, 'entities')),
    quests: normalized.quests.map((quest) => createSyncEntry(quest, 'quests')),
    spells: normalized.spells.map((spell) => createSyncEntry(spell, 'spells')),
    auras: normalized.auras.map((aura) => createSyncEntry(aura, 'auras')),
  };
}

function buildReplaceEntry(record, section) {
  const syncEntry = createSyncEntry(record, section);
  return {
    AssetId: syncEntry.assetId,
    ClassType: syncEntry.classType,
    JsonData: syncEntry.jsonData,
    IsEnabled: true,
  };
}

export function buildReplaceRequest(data) {
  const normalized = hydrateGameData(normalizeGameData(data));

  return {
    VersionTag: `web-${new Date().toISOString().replace(/[:.]/g, '-')}`,
    Notes: 'Web GameDataWorkspace upload',
    Items: normalized.items.map((item) => buildReplaceEntry(item, 'items')),
    Entities: normalized.entities.map((entity) => buildReplaceEntry(entity, 'entities')),
    Quests: normalized.quests.map((quest) => buildReplaceEntry(quest, 'quests')),
    Spells: normalized.spells.map((spell) => buildReplaceEntry(spell, 'spells')),
    Auras: normalized.auras.map((aura) => buildReplaceEntry(aura, 'auras')),
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
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    const message = error?.message || 'Failed to fetch.';
    throw new Error(`Network request failed. Verify the endpoint, CORS policy, and admin headers. ${message}`);
  }

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
  const snapshot = await fetchJson(url, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout?.(Math.max(1, Number(settings.requestTimeoutSeconds || 60)) * 1000),
  });
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
