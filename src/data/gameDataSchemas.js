export const gameDataSections = [
  { key: 'items', label: 'Items', accent: 'emerald', description: 'Equipment, consumables, materials and quest items.', icon: 'Package' },
  { key: 'auras', label: 'Auras', accent: 'violet', description: 'Buffs, debuffs and level-based aura effects.', icon: 'Sparkles' },
  { key: 'entities', label: 'Entities', accent: 'sky', description: 'NPCs, enemies, loot tables and vendors.', icon: 'Users' },
  { key: 'quests', label: 'Quests', accent: 'amber', description: 'Story flow, objectives, NPCs and rewards.', icon: 'ScrollText' },
  { key: 'spells', label: 'Spells', accent: 'fuchsia', description: 'Combat abilities, targeting and aura integration.', icon: 'Wand2' },
  { key: 'versions', label: 'Versions', accent: 'slate', description: 'Published game data versions and release notes.', icon: 'History' },
];

export const gameDataSchemas = {
  items: {
    title: 'Items',
    subtitle: 'Human-friendly catalog for your game items.',
    searchPlaceholder: 'Search items by id, name or type...',
    sections: [
      {
        title: 'Identity',
        fields: [
          { key: 'assetId', label: 'Asset ID', type: 'text' },
          { key: 'displayName', label: 'Display Name', type: 'text' },
          { key: 'itemType', label: 'Item Type', type: 'select', options: ['Equipment', 'Consumable', 'Material', 'Quest', 'Simple'] },
          { key: 'rarity', label: 'Rarity', type: 'select', options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] },
          { key: 'description', label: 'Description', type: 'textarea', full: true },
        ],
      },
      {
        title: 'Economy & Rules',
        fields: [
          { key: 'buyPrice', label: 'Buy Price', type: 'number' },
          { key: 'sellPrice', label: 'Sell Price', type: 'number' },
          { key: 'requiredLevel', label: 'Required Level', type: 'number' },
          { key: 'maxStack', label: 'Max Stack', type: 'number' },
          { key: 'isTradable', label: 'Tradable', type: 'boolean' },
          { key: 'isSellable', label: 'Sellable', type: 'boolean' },
          { key: 'isDroppable', label: 'Droppable', type: 'boolean' },
          { key: 'isUnique', label: 'Unique', type: 'boolean' },
        ],
      },
      {
        title: 'Type Specific',
        fields: [
          { key: 'equipmentSlot', label: 'Equipment Slot', type: 'text' },
          { key: 'weaponType', label: 'Weapon Type', type: 'text' },
          { key: 'armorType', label: 'Armor Type', type: 'text' },
          { key: 'healthRestore', label: 'Health Restore', type: 'number' },
          { key: 'manaRestore', label: 'Mana Restore', type: 'number' },
          { key: 'grantedAuraId', label: 'Granted Aura ID', type: 'text' },
          { key: 'relatedProfession', label: 'Profession', type: 'text' },
          { key: 'relatedQuestId', label: 'Related Quest ID', type: 'text' },
        ],
      },
    ],
  },
  auras: {
    title: 'Auras',
    subtitle: 'Buff and debuff definitions with scalable levels.',
    searchPlaceholder: 'Search auras by id, name or type...',
    sections: [
      {
        title: 'Identity',
        fields: [
          { key: 'assetId', label: 'Asset ID', type: 'text' },
          { key: 'displayName', label: 'Display Name', type: 'text' },
          { key: 'auraType', label: 'Aura Type', type: 'select', options: ['Buff', 'Debuff'] },
          { key: 'damageType', label: 'Damage Type', type: 'select', options: ['Physical', 'Magical', 'True'] },
          { key: 'description', label: 'Description', type: 'textarea', full: true },
        ],
      },
      {
        title: 'Current Level Preview',
        fields: [
          { key: 'duration', label: 'Duration', type: 'number' },
          { key: 'tickRate', label: 'Tick Rate', type: 'number' },
          { key: 'amountPerTick', label: 'Amount Per Tick', type: 'number' },
          { key: 'statCoefficient', label: 'Stat Coefficient', type: 'number' },
          { key: 'controlEffects', label: 'Control Effects', type: 'text' },
          { key: 'breakOnMove', label: 'Break On Move', type: 'boolean' },
          { key: 'breakOnDamage', label: 'Break On Damage', type: 'boolean' },
        ],
      },
    ],
  },
  entities: {
    title: 'Entities',
    subtitle: 'NPCs, enemies, factions and loot behavior.',
    searchPlaceholder: 'Search entities by id, name or role...',
    sections: [
      {
        title: 'Identity',
        fields: [
          { key: 'assetId', label: 'Asset ID', type: 'text' },
          { key: 'displayName', label: 'Display Name', type: 'text' },
          { key: 'faction', label: 'Faction', type: 'select', options: ['Neutral', 'Enemy'] },
          { key: 'npcRole', label: 'NPC Role', type: 'text' },
          { key: 'baseLevel', label: 'Base Level', type: 'number' },
          { key: 'damageType', label: 'Damage Type', type: 'select', options: ['Physical', 'Magical', 'True'] },
          { key: 'description', label: 'Description', type: 'textarea', full: true },
        ],
      },
      {
        title: 'Rewards & Links',
        fields: [
          { key: 'potentialExpDrop', label: 'XP Reward', type: 'number' },
          { key: 'vendorCount', label: 'Vendor Items', type: 'number' },
          { key: 'dropCount', label: 'Potential Drops', type: 'number' },
          { key: 'questCount', label: 'Related Quests', type: 'number' },
        ],
      },
    ],
  },
  quests: {
    title: 'Quests',
    subtitle: 'Narrative progression, requirements and rewards.',
    searchPlaceholder: 'Search quests by id, title or zone...',
    sections: [
      {
        title: 'Identity',
        fields: [
          { key: 'assetId', label: 'Asset ID', type: 'text' },
          { key: 'displayName', label: 'Quest Title', type: 'text' },
          { key: 'category', label: 'Category', type: 'select', options: ['MainStory', 'SideQuest', 'Daily', 'Weekly', 'Event', 'Repeatable'] },
          { key: 'questZoneId', label: 'Zone ID', type: 'text' },
          { key: 'minLevel', label: 'Minimum Level', type: 'number' },
          { key: 'allowedClasses', label: 'Allowed Classes', type: 'text' },
          { key: 'questLogSummary', label: 'Quest Log Summary', type: 'textarea', full: true },
        ],
      },
      {
        title: 'Flow & Rewards',
        fields: [
          { key: 'questGiverId', label: 'Quest Giver', type: 'text' },
          { key: 'turnInNpcId', label: 'Turn-In NPC', type: 'text' },
          { key: 'requiredQuestId', label: 'Required Quest', type: 'text' },
          { key: 'nextQuestId', label: 'Next Quest', type: 'text' },
          { key: 'goalCount', label: 'Objectives', type: 'number' },
          { key: 'expReward', label: 'XP Reward', type: 'number' },
          { key: 'currencyReward', label: 'Currency Reward', type: 'number' },
        ],
      },
    ],
  },
  spells: {
    title: 'Spells',
    subtitle: 'Ability definitions, targeting and aura application.',
    searchPlaceholder: 'Search spells by id, title or mechanic...',
    sections: [
      {
        title: 'Identity',
        fields: [
          { key: 'assetId', label: 'Asset ID', type: 'text' },
          { key: 'displayName', label: 'Spell Name', type: 'text' },
          { key: 'mechanicType', label: 'Mechanic Type', type: 'text' },
          { key: 'damageType', label: 'Damage Type', type: 'select', options: ['Physical', 'Magical', 'True'] },
          { key: 'targetType', label: 'Target Type', type: 'select', options: ['Helpful', 'Harmful', 'Both'] },
          { key: 'description', label: 'Description', type: 'textarea', full: true },
        ],
      },
      {
        title: 'Combat & Timing',
        fields: [
          { key: 'manaCost', label: 'Mana Cost', type: 'number' },
          { key: 'range', label: 'Range', type: 'number' },
          { key: 'castTime', label: 'Cast Time', type: 'number' },
          { key: 'cooldown', label: 'Cooldown', type: 'number' },
          { key: 'damageAmount', label: 'Damage Amount', type: 'number' },
          { key: 'healAmount', label: 'Heal Amount', type: 'number' },
          { key: 'statCoefficient', label: 'Stat Coefficient', type: 'number' },
          { key: 'auraToApplyId', label: 'Applied Aura ID', type: 'text' },
        ],
      },
    ],
  },
  versions: {
    title: 'Versions',
    subtitle: 'Snapshot publication history and release metadata.',
    searchPlaceholder: 'Search versions by tag, hash or note...',
    sections: [
      {
        title: 'Version Details',
        fields: [
          { key: 'versionNumber', label: 'Version Number', type: 'number' },
          { key: 'versionTag', label: 'Version Tag', type: 'text' },
          { key: 'contentHash', label: 'Content Hash', type: 'text' },
          { key: 'publishedAt', label: 'Published At', type: 'text' },
          { key: 'notes', label: 'Notes', type: 'textarea', full: true },
          { key: 'isActive', label: 'Active', type: 'boolean' },
        ],
      },
    ],
  },
};

export const mockGameData = {
  items: [
    {
      assetId: 'item_rustfang_sword', displayName: 'Rustfang Sword', itemType: 'Equipment', rarity: 'Common',
      description: 'A dull, slightly rusted blade.', buyPrice: 20, sellPrice: 4, requiredLevel: 1, maxStack: 1,
      isTradable: true, isSellable: true, isDroppable: true, isUnique: false,
      equipmentSlot: 'MainHand', weaponType: 'Sword', armorType: 'None', healthRestore: 0, manaRestore: 0,
      grantedAuraId: '', relatedProfession: '', relatedQuestId: ''
    },
    {
      assetId: 'item_beast_hide', displayName: 'Beast Hide', itemType: 'Material', rarity: 'Common',
      description: 'Coarse skin stripped from wild beasts.', buyPrice: 6, sellPrice: 2, requiredLevel: 1, maxStack: 99,
      isTradable: true, isSellable: true, isDroppable: true, isUnique: false,
      equipmentSlot: '', weaponType: '', armorType: '', healthRestore: 0, manaRestore: 0,
      grantedAuraId: '', relatedProfession: 'Leatherworking', relatedQuestId: ''
    },
  ],
  auras: [
    {
      assetId: 'aura_burning_wound', displayName: 'Burning Wound', auraType: 'Debuff', damageType: 'Magical',
      description: 'Searing damage over time.', duration: 6, tickRate: 1, amountPerTick: 12, statCoefficient: 0.2,
      controlEffects: 'None', breakOnMove: false, breakOnDamage: false
    },
    {
      assetId: 'aura_blessing_of_dawn', displayName: 'Blessing of Dawn', auraType: 'Buff', damageType: 'Magical',
      description: 'Improves survivability and recovery.', duration: 12, tickRate: 2, amountPerTick: 8, statCoefficient: 0.15,
      controlEffects: 'None', breakOnMove: false, breakOnDamage: false
    },
  ],
  entities: [
    {
      assetId: 'entity_mayor_higgins', displayName: 'Mayor Higgins', faction: 'Neutral', npcRole: 'QuestGiver', baseLevel: 5,
      damageType: 'Physical', description: 'Town leader and starter quest giver.', potentialExpDrop: 0, vendorCount: 0, dropCount: 0, questCount: 3
    },
    {
      assetId: 'entity_wild_boar', displayName: 'Wild Boar', faction: 'Enemy', npcRole: 'None', baseLevel: 3,
      damageType: 'Physical', description: 'Aggressive woodland creature.', potentialExpDrop: 24, vendorCount: 0, dropCount: 2, questCount: 1
    },
  ],
  quests: [
    {
      assetId: 'quest_boar_problem', displayName: 'The Boar Problem', category: 'SideQuest', questZoneId: 'zone_whispering_woodlands',
      minLevel: 1, allowedClasses: 'All', questLogSummary: 'Thin the boar population near the village.',
      questGiverId: 'entity_mayor_higgins', turnInNpcId: 'entity_mayor_higgins', requiredQuestId: '', nextQuestId: '',
      goalCount: 2, expReward: 120, currencyReward: 35
    },
  ],
  spells: [
    {
      assetId: 'spell_arcane_bolt', displayName: 'Arcane Bolt', mechanicType: 'Instant Strike', damageType: 'Magical', targetType: 'Harmful',
      description: 'A quick ranged magical blast.', manaCost: 15, range: 30, castTime: 1.5, cooldown: 2,
      damageAmount: 20, healAmount: 0, statCoefficient: 1, auraToApplyId: ''
    },
    {
      assetId: 'spell_rejuvenating_wave', displayName: 'Rejuvenating Wave', mechanicType: 'Ground AoE', damageType: 'Magical', targetType: 'Helpful',
      description: 'Restores health to allies in a selected area.', manaCost: 30, range: 25, castTime: 2.2, cooldown: 8,
      damageAmount: 0, healAmount: 25, statCoefficient: 1.2, auraToApplyId: 'aura_blessing_of_dawn'
    },
  ],
  versions: [
    {
      versionNumber: 12, versionTag: 'editor-20260512-120911', contentHash: '1cfe1389afbe596af1e0aa7aa284005d960d8d7907e61141faddd3aca047f234',
      publishedAt: '2026-05-12 12:09:11 UTC', notes: 'Unity GameDatabaseEditor upload', isActive: true
    },
    {
      versionNumber: 11, versionTag: 'editor-20260510-183002', contentHash: 'a8d4a0f1dd4fe3317a76f14bf2dd5c49010b2bf426d7da8312ff33809a82c717',
      publishedAt: '2026-05-10 18:30:02 UTC', notes: 'Balancing pass and loot cleanup', isActive: false
    },
  ],
};
