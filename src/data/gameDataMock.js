export const USER_ROLES = ['Owner', 'Publisher', 'Moderator', 'Viewer'];
export const GAME_DATA_EDITOR_ROLES = ['owner', 'publisher'];

export const QUEST_CATEGORIES = [
  { value: 0, label: 'Main Story' },
  { value: 1, label: 'Side Quest' },
  { value: 2, label: 'Daily' },
  { value: 3, label: 'Weekly' },
  { value: 4, label: 'Event' },
  { value: 5, label: 'Repeatable' },
];

export const QUEST_OBJECTIVE_TYPES = [
  { value: 0, label: 'Kill' },
  { value: 1, label: 'Talk' },
  { value: 2, label: 'Collect' },
  { value: 3, label: 'Explore' },
  { value: 4, label: 'Interact' },
  { value: 5, label: 'Use Item On' },
];

export const CLASS_FLAGS = [
  { value: 1, label: 'Warrior' },
  { value: 2, label: 'Mage' },
  { value: 4, label: 'Priest' },
  { value: 8, label: 'Rogue' },
  { value: 16, label: 'Hunter' },
];

export const ITEM_TYPE_OPTIONS = [
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Consumable', label: 'Consumable' },
  { value: 'Material', label: 'Material' },
  { value: 'Quest', label: 'Quest' },
  { value: 'Trash', label: 'Trash' },
  { value: 'Misc', label: 'Misc' },
];

export const ITEM_RARITIES = [
  { value: 0, label: 'Common' },
  { value: 1, label: 'Uncommon' },
  { value: 2, label: 'Rare' },
  { value: 3, label: 'Epic' },
  { value: 4, label: 'Legendary' },
  { value: 5, label: 'Artifact' },
];

export const ITEM_BIND_TYPES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Bind On Pickup' },
  { value: 2, label: 'Bind On Equip' },
];

export const EQUIPMENT_SLOTS = [
  { value: -1, label: 'None' },
  { value: 0, label: 'Head' },
  { value: 1, label: 'Necklace' },
  { value: 2, label: 'Body' },
  { value: 3, label: 'Hands' },
  { value: 4, label: 'Legs' },
  { value: 5, label: 'Feet' },
  { value: 6, label: 'Ring 1' },
  { value: 7, label: 'Ring 2' },
  { value: 8, label: 'Main Hand' },
  { value: 9, label: 'Off Hand' },
];

export const WEAPON_TYPES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Sword' },
  { value: 2, label: 'Axe' },
  { value: 3, label: 'Mace' },
  { value: 4, label: 'Dagger' },
  { value: 5, label: 'Staff' },
  { value: 6, label: 'Bow' },
  { value: 7, label: 'Wand' },
];

export const ARMOR_TYPES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Cloth' },
  { value: 2, label: 'Leather' },
  { value: 3, label: 'Mail' },
  { value: 4, label: 'Plate' },
  { value: 5, label: 'Shield' },
];

export const PROFESSION_TYPES = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Blacksmithing' },
  { value: 2, label: 'Alchemy' },
  { value: 3, label: 'Tailoring' },
  { value: 4, label: 'Woodworking' },
];

export const rawGameData = {
  items: [
    { id: 'item_initiates_rations', displayName: "Initiate's Rations", classType: 'ConsumableItem' },
    { id: 'item_agate_amulet', displayName: 'Agate Amulet', classType: 'EquipmentItem' },
    { id: 'item_iron_gladius', displayName: 'Iron Gladius', classType: 'EquipmentItem' },
    { id: 'item_stalker_boots', displayName: 'Stalker Boots', classType: 'EquipmentItem' },
    { id: 'item_anti_venom_poultice', displayName: 'Anti-Venom Poultice', classType: 'ConsumableItem' },
    { id: 'item_antivenom_poultice', displayName: 'Anti-Venom Poultice', classType: 'ConsumableItem' },
    { id: 'item_minor_health_potion', displayName: 'Minor Health Potion', classType: 'ConsumableItem' },
    { id: 'item_purple_aether_crystal', displayName: 'Purple Aether Crystal', classType: 'QuestItem' },
    { id: 'item_enchanted_log', displayName: 'Enchanted Log', classType: 'MaterialItem' },
    { id: 'item_beast_hide', displayName: 'Beast Hide', classType: 'MaterialItem' },
    { id: 'item_peacebloom', displayName: 'Peace-bloom', classType: 'QuestItem' },
    { id: 'item_animal_meat', displayName: 'Animal Meat', classType: 'MaterialItem' },
    { id: 'item_travelers_rations', displayName: "Traveler's Rations", classType: 'ConsumableItem' },
    { id: 'item_honey_wax', displayName: 'Honey Wax', classType: 'QuestItem' },
    { id: 'item_river_trout', displayName: 'River Trout', classType: 'QuestItem' },
    { id: 'item_spider_silk', displayName: 'Spider Silk', classType: 'MaterialItem' },
    { id: 'item_copper_ore', displayName: 'Copper Ore', classType: 'QuestItem' },
    { id: 'item_suspicious_package', displayName: 'Suspicious Package', classType: 'QuestItem' },
    { id: 'item_stolen_goods', displayName: 'Stolen Goods', classType: 'MaterialItem' },
    { id: 'item_slimy_skin', displayName: 'Slimy Skin', classType: 'MaterialItem' },
    { id: 'item_sarahs_necklace', displayName: "Sarah's Necklace", classType: 'QuestItem' },
    { id: 'item_cultist_ritual_staff', displayName: 'Cultist Ritual Staff', classType: 'EquipmentItem' },
    { id: 'item_moonflower', displayName: 'Moon-flower', classType: 'QuestItem' },
    { id: 'item_moon_flower', displayName: 'Moon-flower', classType: 'QuestItem' },
    { id: 'item_lesser_health_potion', displayName: 'Lesser Health Potion', classType: 'ConsumableItem' },
  ],
  entities: [
    { id: 'entity_guard_tomas', displayName: 'Guard Tomas', npcRole: 1 },
    { id: 'entity_mayor_higgins', displayName: 'Mayor Higgins', npcRole: 1 },
    { id: 'entity_tainted_boar', displayName: 'Tainted Boar', npcRole: 0 },
    { id: 'entity_hunter_garret', displayName: 'Hunter Garret', npcRole: 9 },
    { id: 'entity_starving_wolf', displayName: 'Starving Wolf', npcRole: 0 },
    { id: 'entity_scout_finn', displayName: 'Scout Finn', npcRole: 1 },
    { id: 'entity_venomous_spider', displayName: 'Venomous Spider', npcRole: 0 },
    { id: 'entity_priestess_anna', displayName: 'Priestess Anna', npcRole: 1 },
    { id: 'entity_shadow_poacher', displayName: 'Shadow Poacher', npcRole: 0 },
    { id: 'entity_woodcutter_jack', displayName: 'Woodcutter Jack', npcRole: 1 },
    { id: 'entity_miller_sam', displayName: 'Miller Sam', npcRole: 1 },
    { id: 'entity_herbalist_rose', displayName: 'Herbalist Rose', npcRole: 9 },
    { id: 'entity_martha_the_cook', displayName: 'Martha the Cook', npcRole: 11 },
    { id: 'entity_beekeeper_arthur', displayName: 'Beekeeper Arthur', npcRole: 1 },
    { id: 'entity_fisher_ben', displayName: 'Fisher Ben', npcRole: 1 },
    { id: 'entity_weaver_clara', displayName: 'Weaver Clara', npcRole: 3 },
    { id: 'entity_miner_kael', displayName: 'Miner Kael', npcRole: 1 },
    { id: 'entity_smuggler_pete', displayName: 'Smuggler Pete', npcRole: 67 },
    { id: 'entity_territorial_bear', displayName: 'Territorial Bear', npcRole: 0 },
    { id: 'entity_farmer_giles', displayName: 'Farmer Giles', npcRole: 3 },
    { id: 'entity_blacksmith_brom', displayName: 'Blacksmith Brom', npcRole: 3 },
    { id: 'entity_scout_liam_injured', displayName: 'Scout Liam (Injured)', npcRole: 1 },
    { id: 'entity_thicket_treant', displayName: 'Thicket Treant', npcRole: 0 },
    { id: 'entity_guard_henrik', displayName: 'Guard Henrik', npcRole: 1 },
    { id: 'entity_refugee_sarah', displayName: 'Refugee Sarah', npcRole: 1 },
    { id: 'entity_mutated_hornet', displayName: 'Mutated Hornet', npcRole: 0 },
    { id: 'entity_river_toad', displayName: 'River Toad', npcRole: 0 },
    { id: 'entity_rabid_fox', displayName: 'Rabid Fox', npcRole: 0 },
    { id: 'entity_gorehorn_the_aethercrowned_elk', displayName: 'Gore-Horn', npcRole: 0 },
  ],
  quests: [
    { id: 'quest_welcome_to_the_soil', displayName: 'Welcome to the Soil', description: 'Speak with Mayor Higgins in the Forward Camp to offer your help.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 1, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'Ah, another survivor. We need every hand we can get. Go to the center of the camp and speak with Mayor Higgins. He coordinates our survival efforts here.', progressDialogue: "The Mayor is at the camp center. Don't keep him waiting.", completionDialogue: "Tomas told me a new recruit was coming. We're on the brink of starvation, initiate. I hope you're ready for some real work.", questLogSummary: 'Speak with Mayor Higgins in the Forward Camp.', goals: [{ type: 1, targetId: 'entity_mayor_higgins', requiredAmount: 1 }], questGiverId: 'entity_guard_tomas', turnInNpcId: 'entity_mayor_higgins', expReward: 50, currencyReward: 0, guaranteedItemRewards: [{ itemId: 'item_initiates_rations', amount: 2 }], choiceItemRewards: [], nextQuestId: 'quest_securing_the_harvest' },
    { id: 'quest_securing_the_harvest', displayName: 'Securing the Harvest', description: 'Protect the food supply by culling the tainted boars.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 1, requiredQuestId: 'quest_welcome_to_the_soil', allowedClasses: -1, offerDialogue: "The boars are uprooting our crops. Without that harvest, the colony won't last the winter. Deal with 8 of them in the carrot fields.", progressDialogue: 'The carrot fields are still being trampled. Have you cleared those boars yet?', completionDialogue: "Excellent work. It's a small victory, but it keeps us fed for another day. Take these rations.", questLogSummary: 'Kill 8 Tainted Boars in the fields.', goals: [{ type: 0, targetId: 'entity_tainted_boar', requiredAmount: 8 }], questGiverId: 'entity_mayor_higgins', turnInNpcId: 'entity_mayor_higgins', expReward: 150, currencyReward: 10, guaranteedItemRewards: [{ itemId: 'item_initiates_rations', amount: 2 }], choiceItemRewards: [], nextQuestId: 'quest_the_hunters_path' },
    { id: 'quest_the_hunters_path', displayName: "The Hunter's Path", description: 'Take the scouting report to Hunter Garret.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: 'quest_securing_the_harvest', allowedClasses: -1, offerDialogue: "Take this report to Garret. He's overseeing the perimeter and needs to know about the boar activity further in the brush.", progressDialogue: 'Garret is waiting for that report at the northern hunting post.', completionDialogue: "The Mayor sent this? I thought he'd forgotten about the movement in the deep trees. We have a wolf problem.", questLogSummary: 'Deliver the report to Hunter Garret.', goals: [{ type: 1, targetId: 'entity_hunter_garret', requiredAmount: 1 }], questGiverId: 'entity_mayor_higgins', turnInNpcId: 'entity_hunter_garret', expReward: 75, currencyReward: 5, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: 'quest_culling_the_pack' },
    { id: 'quest_culling_the_pack', displayName: 'Culling the Pack', description: 'Reduce the starving wolf population to protect the settlement.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: 'quest_the_hunters_path', allowedClasses: -1, offerDialogue: "The wolves are starving and bold. They've started picking off our livestock. Thin their ranks before they target the children.", progressDialogue: 'I still hear too much howling at night. Keep hunting until 10 of them are dead.', completionDialogue: "That should give us some peace for a few nights. Take this amulet, it was found on a previous hunter who didn't make it back.", questLogSummary: 'Kill 10 Starving Wolves.', goals: [{ type: 0, targetId: 'entity_starving_wolf', requiredAmount: 10 }], questGiverId: 'entity_hunter_garret', turnInNpcId: 'entity_hunter_garret', expReward: 200, currencyReward: 15, guaranteedItemRewards: [{ itemId: 'item_agate_amulet', amount: 1 }], choiceItemRewards: [{ itemId: 'item_iron_gladius', amount: 1 }, { itemId: 'item_stalker_boots', amount: 1 }], nextQuestId: '' },
    { id: 'quest_a_missing_scout', displayName: 'A Missing Scout', description: 'Locate Scout Finn deep in the woods before the Aether corruption takes him.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: 'quest_culling_the_pack', allowedClasses: -1, offerDialogue: "Finn went to scout the Aether source and hasn't checked back in. Take this anti-venom poultice; if he's in the ruins, he'll likely need it.", progressDialogue: 'Any sign of Finn? He usually stays near the old ruins.', completionDialogue: "You found me... I can't move, the web is too thick...", questLogSummary: 'Find Scout Finn in the deep woods.', goals: [{ type: 1, targetId: 'entity_scout_finn', requiredAmount: 1 }], questGiverId: 'entity_hunter_garret', turnInNpcId: 'entity_scout_finn', expReward: 100, currencyReward: 10, guaranteedItemRewards: [{ itemId: 'item_anti_venom_poultice', amount: 1 }], choiceItemRewards: [], nextQuestId: 'quest_web_of_lies' },
    { id: 'quest_web_of_lies', displayName: 'Web of Lies', description: 'Clear the spiders to rescue Scout Finn.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: 'quest_a_missing_scout', allowedClasses: -1, offerDialogue: "They're everywhere! Please, if you kill the venomous ones, I can cut myself loose from this sticky mess!", progressDialogue: "There's too many legs! Keep swinging, adventurer!", completionDialogue: "I'm free. Thank the stars. I saw cultists in the cave... you need to tell the Mayor immediately.", questLogSummary: 'Kill 8 Venomous Spiders near Finn.', goals: [{ type: 0, targetId: 'entity_venomous_spider', requiredAmount: 8 }], questGiverId: 'entity_scout_finn', turnInNpcId: 'entity_scout_finn', expReward: 250, currencyReward: 20, guaranteedItemRewards: [{ itemId: 'item_minor_health_potion', amount: 2 }], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_the_aethers_source', displayName: "The Aether's Source", description: 'Collect Aether crystals from the cultists.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 4, requiredQuestId: 'quest_web_of_lies', allowedClasses: -1, offerDialogue: 'The cultists are funneling raw energy through these crystals. We must study them to survive. Rip 5 crystals from their hands.', progressDialogue: 'The violet hum of the Aether is getting louder. Bring me those crystals.', completionDialogue: 'Anna, begin the containment ritual. These crystals contain more power than we calculated.', questLogSummary: 'Retrieve 5 Purple Aether Crystals from woodland cultists.', goals: [{ type: 2, targetId: 'item_purple_aether_crystal', requiredAmount: 5 }], questGiverId: 'entity_mayor_higgins', turnInNpcId: 'entity_priestess_anna', expReward: 300, currencyReward: 25, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_the_heart_of_the_woods', displayName: 'The Heart of the Woods', description: "Locate Gore-Horn's clearing.", category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: true, minLevel: 5, requiredQuestId: 'quest_the_aethers_source', allowedClasses: -1, offerDialogue: 'It all leads to the central clearing. The corruption is strongest there. Find it, but do not engage yet.', progressDialogue: 'The path is obscured by lila mist. Keep searching.', completionDialogue: '', questLogSummary: 'Explore the Heart of the Woods clearing.', goals: [{ type: 3, targetId: 'zone_heart_woods', requiredAmount: 1 }], questGiverId: 'entity_mayor_higgins', turnInNpcId: '', expReward: 150, currencyReward: 0, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: 'quest_boss_breaking_the_first_seal' },
    { id: 'quest_boss_breaking_the_first_seal', displayName: '[BOSS] Breaking the First Seal', description: 'Defeat Gore-Horn to open the way.', category: 0, questZoneId: 'the_whispering_woodlands', canBeAbandoned: false, canBeShared: false, autoComplete: false, minLevel: 5, requiredQuestId: 'quest_the_heart_of_the_woods', allowedClasses: -1, offerDialogue: "The elk Gore-Horn is the anchor. Its corruption is locking the simulation's teleport gate. Kill it to break the seal and advance to the next floor.", progressDialogue: 'Gore-Horn still stands at the center of the clearing. The gate remains locked.', completionDialogue: 'It is done. The elk is at peace, and the way forward is open. Take this ritual staff; it was recovered from the heart of the corruption.', questLogSummary: 'Defeat Gore-Horn, The Aether-Crowned Elk.', goals: [{ type: 0, targetId: 'entity_gorehorn_the_aethercrowned_elk', requiredAmount: 1 }], questGiverId: 'entity_mayor_higgins', turnInNpcId: 'entity_mayor_higgins', expReward: 1000, currencyReward: 100, guaranteedItemRewards: [{ itemId: 'item_cultist_ritual_staff', amount: 1 }], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_wood_for_the_winter', displayName: 'Wood for the Winter', description: 'Gather enchanted logs for camp fortifications.', category: 5, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 4, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'The storms are getting worse. We need enchanted wood from the Treants to keep the walls standing. Bring me 10 logs.', progressDialogue: "I need 10 logs, adventurer. The walls won't build themselves.", completionDialogue: 'Sturdy stuff. This will hold against the Aether for a while.', questLogSummary: 'Collect 10 Enchanted Logs from Treants.', goals: [{ type: 2, targetId: 'item_enchanted_log', requiredAmount: 10 }], questGiverId: 'entity_woodcutter_jack', turnInNpcId: 'entity_woodcutter_jack', expReward: 150, currencyReward: 15, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_herbs_for_the_wounded', displayName: 'Herbs for the Wounded', description: 'Gather Peace-bloom flowers for Herbalist Rose to stock the clinic.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'The clinic is overwhelmed. Peace-bloom is the only thing that soothes the Aether burns. Find 10 flowers in the woodland clearing.', progressDialogue: 'The wounded are waiting. Have you gathered the herbs?', completionDialogue: "You have a healer's heart. These salves will save many lives today.", questLogSummary: 'Collect 10 Peace-bloom flowers for Herbalist Rose.', goals: [{ type: 2, targetId: 'item_peacebloom', requiredAmount: 10 }], questGiverId: 'entity_herbalist_rose', turnInNpcId: 'entity_herbalist_rose', expReward: 120, currencyReward: 8, guaranteedItemRewards: [{ itemId: 'item_lesser_health_potion', amount: 1 }], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_fresh_meat', displayName: 'Fresh Meat', description: 'Hunt animal meat for the camp stew.', category: 5, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 1, requiredQuestId: '', allowedClasses: -1, offerDialogue: "The stew pot is empty and the workers are hungry. Bring me 10 slabs of fresh animal meat. In exchange, I'll give you a prepared traveler's ration.", progressDialogue: "My pot is still waiting. Where's the meat?", completionDialogue: 'Perfect. This will feed the whole camp tonight. Here is your ration, much better than that raw stuff.', questLogSummary: 'Collect 10 Animal Meat.', goals: [{ type: 2, targetId: 'item_animal_meat', requiredAmount: 10 }], questGiverId: 'entity_martha_the_cook', turnInNpcId: 'entity_martha_the_cook', expReward: 100, currencyReward: 10, guaranteedItemRewards: [{ itemId: 'item_travelers_rations', amount: 1 }], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_sticky_situation', displayName: 'Sticky Situation', description: 'Gather Honey Wax from hornet nests.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'Our rain barrels are leaking. I need specialized Honey Wax from the mutated hives to seal them. It is dangerous work, but vital.', progressDialogue: 'The water is still leaking, traveler. I need that wax.', completionDialogue: 'This should hold the water through the next storm. Thank you.', questLogSummary: 'Collect 5 Honey Wax from mutated hives.', goals: [{ type: 2, targetId: 'item_honey_wax', requiredAmount: 5 }], questGiverId: 'entity_beekeeper_arthur', turnInNpcId: 'entity_beekeeper_arthur', expReward: 180, currencyReward: 16, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_fishing_for_beginners', displayName: 'Fishing for Beginners', description: 'Catch River Trout for Fisher Ben.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: '', allowedClasses: -1, offerDialogue: "Even in a simulation, a man's gotta eat something fresh. Catch me 3 River Trout and I'll share my catch with you.", progressDialogue: "The fish aren't biting for you? Try a different spot downstream.", completionDialogue: 'A fine catch! These will make a grand dinner for the children in the camp.', questLogSummary: 'Catch 3 River Trout for Fisher Ben.', goals: [{ type: 2, targetId: 'item_river_trout', requiredAmount: 3 }], questGiverId: 'entity_fisher_ben', turnInNpcId: 'entity_fisher_ben', expReward: 100, currencyReward: 5, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_a_weavers_thread', displayName: "A Weaver's Thread", description: 'Gather spider silk for Clara.', category: 5, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: '', allowedClasses: -1, offerDialogue: "I'm out of strong thread. The silk from those woodland spiders is perfect for heavy-duty sewing. Bring me 10 lengths.", progressDialogue: 'My loom is idle until I get that silk.', completionDialogue: 'Wonderful. I can start on the guard uniforms now.', questLogSummary: 'Collect 10 Spider Silk.', goals: [{ type: 2, targetId: 'item_spider_silk', requiredAmount: 10 }], questGiverId: 'entity_weaver_clara', turnInNpcId: 'entity_weaver_clara', expReward: 150, currencyReward: 15, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_mining_the_depths', displayName: 'Mining the Depths', description: 'Gather copper ore for Kael.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'The camp infrastructure is failing, initiate. I need raw copper to forge new tools. Strike the nodes along the rocky hillside and bring me 10 chunks.', progressDialogue: 'My forge is cold without that ore. Have you found the copper?', completionDialogue: 'Excellent. This copper is pure enough to mend the perimeter fences. Take this for your effort.', questLogSummary: 'Gather 10 Copper Ore for Miner Kael.', goals: [{ type: 2, targetId: 'item_copper_ore', requiredAmount: 10 }], questGiverId: 'entity_miner_kael', turnInNpcId: 'entity_miner_kael', expReward: 140, currencyReward: 12, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_smugglers_run', displayName: "Smuggler's Run", description: 'Fetch a suspicious package for Pete.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 4, requiredQuestId: '', allowedClasses: -1, offerDialogue: "A package was 'misplaced' near the ruins by the river. Retrieve it for me, no questions asked, and there's a heavy purse in it for you.", progressDialogue: "Don't tell me a bunch of boars scared you off my shipment. Where is it?", completionDialogue: "Seals are intact. Good. Here's your blood money, traveler. Don't spend it all in one place.", questLogSummary: 'Find the Suspicious Package near the river ruins.', goals: [{ type: 2, targetId: 'item_suspicious_package', requiredAmount: 1 }], questGiverId: 'entity_smuggler_pete', turnInNpcId: 'entity_smuggler_pete', expReward: 250, currencyReward: 50, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_bear_necessities', displayName: 'Bear Necessities', description: 'Kill territorial bears near the farms.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: '', allowedClasses: -1, offerDialogue: "Those bears think our carrot fields are their personal snack bar. Show them they're not welcome. Kill 3 of them.", progressDialogue: 'The bears are still wandering the perimeter.', completionDialogue: 'That should scare the rest of them off. Good job.', questLogSummary: 'Kill 3 Territorial Bears.', goals: [{ type: 0, targetId: 'entity_territorial_bear', requiredAmount: 3 }], questGiverId: 'entity_hunter_garret', turnInNpcId: 'entity_hunter_garret', expReward: 220, currencyReward: 18, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_the_fox_menace', displayName: 'The Fox Menace', description: 'Kill rabid foxes attacking the chickens.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: '', allowedClasses: -1, offerDialogue: "The foxes have gone mad! They're getting into the coop every night. Kill 10 of them before we lose all our chickens.", progressDialogue: "I'm still missing a few hens. Keep hunting.", completionDialogue: 'Maybe I can sleep through the night now. Thank you.', questLogSummary: 'Kill 10 Rabid Foxes.', goals: [{ type: 0, targetId: 'entity_rabid_fox', requiredAmount: 10 }], questGiverId: 'entity_farmer_giles', turnInNpcId: 'entity_farmer_giles', expReward: 160, currencyReward: 12, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_poachers_bounty', displayName: "Poacher's Bounty", description: 'Recover stolen goods from poachers.', category: 5, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 4, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'The poachers have caches all over the forest. Raid them and bring back our stolen supplies.', progressDialogue: "We're still missing half our winter coats. Find those goods.", completionDialogue: 'These will go back to their rightful owners. Well done.', questLogSummary: 'Collect 8 Stolen Goods from poachers.', goals: [{ type: 2, targetId: 'item_stolen_goods', requiredAmount: 8 }], questGiverId: 'entity_guard_tomas', turnInNpcId: 'entity_guard_tomas', expReward: 200, currencyReward: 25, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_armor_for_the_guards', displayName: 'Armor for the Guards', description: 'Gather beast hides for Brom.', category: 5, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: '', allowedClasses: -1, offerDialogue: "The guards' leather is cracking. I need fresh hides to patch them up. Bring me 5 quality beast hides.", progressDialogue: "I can't mend anything without raw material.", completionDialogue: "These are thick. They'll make for fine armor padding.", questLogSummary: 'Collect 5 Beast Hides.', goals: [{ type: 2, targetId: 'item_beast_hide', requiredAmount: 5 }], questGiverId: 'entity_blacksmith_brom', turnInNpcId: 'entity_blacksmith_brom', expReward: 180, currencyReward: 20, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_healing_the_sick', displayName: 'Healing the Sick', description: 'Use minor health potions on injured scouts.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 2, requiredQuestId: '', allowedClasses: -1, offerDialogue: 'Liam and the others are in a bad state. Take these potions and make sure they get their medicine.', progressDialogue: 'The scouts are still feverish. Give them the potions.', completionDialogue: "They're stabilizing. Your help was invaluable, initiate.", questLogSummary: 'Use Minor Health Potions on 3 Injured Scouts.', goals: [{ type: 5, targetId: 'entity_scout_liam_injured', requiredAmount: 3 }], questGiverId: 'entity_priestess_anna', turnInNpcId: 'entity_priestess_anna', expReward: 150, currencyReward: 10, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_the_treants_sorrow', displayName: "The Treant's Sorrow", description: 'Kill an enraged Thicket Treant.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 4, requiredQuestId: '', allowedClasses: -1, offerDialogue: "One of the ancient Treants has gone completely berserk. It's smashing our logging equipment. Put it down before someone gets killed.", progressDialogue: 'That thing is still roaring in the grove.', completionDialogue: "It's a shame it had to come to this, but we need the wood to survive.", questLogSummary: 'Kill 1 Thicket Treant.', goals: [{ type: 0, targetId: 'entity_thicket_treant', requiredAmount: 1 }], questGiverId: 'entity_woodcutter_jack', turnInNpcId: 'entity_woodcutter_jack', expReward: 300, currencyReward: 30, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
    { id: 'quest_a_gift_for_anna', displayName: 'A Gift for Anna', description: 'Find a Moonflower.', category: 1, questZoneId: 'the_whispering_woodlands', canBeAbandoned: true, canBeShared: false, autoComplete: false, minLevel: 3, requiredQuestId: '', allowedClasses: -1, offerDialogue: "Priestess Anna gives so much to this colony and asks for nothing. Find her a Rare Moon-flower from the deep groves as a token of our gratitude.", progressDialogue: 'The Moon-flower only grows where the mist is thickest. Be careful.', completionDialogue: 'For me? Oh, Higgins is far too sentimental... but it is beautiful. Thank you, adventurer.', questLogSummary: 'Find 1 Moon-flower for Priestess Anna.', goals: [{ type: 2, targetId: 'item_moonflower', requiredAmount: 1 }], questGiverId: 'entity_mayor_higgins', turnInNpcId: 'entity_priestess_anna', expReward: 180, currencyReward: 0, guaranteedItemRewards: [], choiceItemRewards: [], nextQuestId: '' },
  ],
  spells: [],
  auras: [],
};
