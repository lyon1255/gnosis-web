import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Package, Plus, Save, Trash2, Download, Search, Box, Sword, FlaskConical, Hammer, Scroll } from 'lucide-react';

const defaultItem = {
  id: '',
  name: '',
  description: '',
  itemType: 'Equipment', // Equipment, Consumable, Material, Quest, Trash
  rarity: 'Common',
  addressableKey: 'Assets/Prefabs/Items/',
  iconAddress: 'UI/Icons/',
  
  // Economy & Rules
  buyPrice: 0,
  sellPrice: 0,
  requiredLevel: 1,
  maxStack: 1,
  isTradable: true,
  isSellable: true,
  isDroppable: true,
  bindType: 'None', // None, BindOnPickup, BindOnEquip
  isUnique: false,

  // Equipment Specific
  equipmentSlot: 'None',
  weaponType: 'None',
  armorType: 'None',
  isTwoHanded: false,
  maxDurability: 100,
  statsFlat: { damage: 0, defense: 0, health: 0 },
  
  // Consumable Specific
  healthRestore: 0,
  manaRestore: 0,
  grantedAuraId: '',
  
  // Material Specific
  materialTier: 1,
  relatedProfession: 'None',

  // Quest Specific
  relatedQuestID: ''
};

export default function ItemEditor() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Adatok betöltése Firestore-ból
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'items'), (snap) => {
      const arr = [];
      snap.forEach(doc => arr.push({ firestoreId: doc.id, ...doc.data() }));
      setItems(arr.sort((a, b) => a.name.localeCompare(b.name)));
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!editingItem.id || !editingItem.name) {
      alert("ID and Name are required!");
      return;
    }
    try {
      // Az item saját ID-ját használjuk Firestore Document ID-ként
      await setDoc(doc(db, 'items', editingItem.id), editingItem);
      alert("Item synced to database!");
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      alert("Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Purge this item from the database?")) {
      await deleteDoc(doc(db, 'items', id));
      if (editingItem?.id === id) setEditingItem(null);
    }
  };

  // UNITY EXPORT GENERÁTOR
  const exportForUnity = () => {
    // Csak a releváns mezőket exportáljuk a C# deserialize-hoz
    const exportData = {
      Items: items.map(item => {
        const cleanItem = { ...item };
        delete cleanItem.firestoreId; // Ne küldjük át a firestore belső dolgokat
        return cleanItem;
      })
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "MasterItemData.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterType === 'All' || item.itemType === filterType)
  );

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Equipment': return <Sword size={16} className="text-[#2EF2C4]"/>;
      case 'Consumable': return <FlaskConical size={16} className="text-red-400"/>;
      case 'Material': return <Hammer size={16} className="text-yellow-400"/>;
      case 'Quest': return <Scroll size={16} className="text-[#7A3CFF]"/>;
      default: return <Box size={16} className="text-white/50"/>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* BAL SÁV: LISTA ÉS SZŰRŐK */}
      <div className="w-full lg:w-1/3 flex flex-col bg-[#162031] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-montserrat font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Package size={18} className="text-[#2EF2C4]"/> Item Database
            </h3>
            <button onClick={exportForUnity} className="p-2 bg-[#7A3CFF]/20 text-[#7A3CFF] hover:bg-[#7A3CFF] hover:text-white rounded transition-all" title="Export MasterItemData.json for Unity">
              <Download size={18}/>
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 text-white/30" size={16} />
            <input 
              type="text" placeholder="Search items..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0E1624] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#2EF2C4]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {['All', 'Equipment', 'Consumable', 'Material', 'Quest', 'Trash'].map(type => (
              <button 
                key={type} onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase whitespace-nowrap transition-all ${filterType === type ? 'bg-[#2EF2C4] text-[#0E1624]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
          <button 
            onClick={() => setEditingItem({ ...defaultItem })}
            className="w-full p-3 border border-dashed border-[#2EF2C4]/30 text-[#2EF2C4] hover:bg-[#2EF2C4]/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase transition-all mb-2"
          >
            <Plus size={16}/> Create New Item
          </button>

          {filteredItems.map(item => (
            <div 
              key={item.firestoreId} 
              onClick={() => setEditingItem({ ...item })}
              className={`p-3 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${editingItem?.id === item.id ? 'bg-[#2EF2C4]/10 border-[#2EF2C4]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                {getTypeIcon(item.itemType)}
                <div>
                  <p className="text-white font-bold text-sm leading-none">{item.name}</p>
                  <p className="text-white/30 text-[10px] font-mono mt-1">{item.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JOBB SÁV: SZERKESZTŐ FORM */}
      <div className="w-full lg:w-2/3 bg-[#162031] border border-white/5 rounded-2xl overflow-y-auto custom-scrollbar relative">
        {!editingItem ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <Package size={64} className="mb-4 opacity-50"/>
            <p className="font-montserrat font-black tracking-widest uppercase">Select an item to edit</p>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            
            {/* Fejléc és Mentés */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 sticky top-0 bg-[#162031] z-10">
              <h2 className="font-montserrat font-black text-2xl text-white flex items-center gap-3">
                {editingItem.id ? 'Edit Item' : 'New Item'}
                <span className={`px-2 py-1 text-[10px] rounded uppercase tracking-widest border border-white/20 ${editingItem.rarity === 'Legendary' ? 'text-orange-400' : 'text-white/50'}`}>
                  {editingItem.rarity}
                </span>
              </h2>
              <div className="flex gap-2">
                <button onClick={() => handleDelete(editingItem.id)} className="p-3 text-red-400 bg-red-400/10 hover:bg-red-400 hover:text-white rounded-xl transition-all">
                  <Trash2 size={18}/>
                </button>
                <button onClick={handleSave} className="px-6 py-3 bg-[#2EF2C4] text-[#0E1624] font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(46,242,196,0.3)]">
                  <Save size={16}/> Save to Database
                </button>
              </div>
            </div>

            {/* IDENTITY SECTION */}
            <section className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-[#2EF2C4] text-xs font-black uppercase tracking-widest mb-4">Identity & Unity Link</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Unique ID (e.g. wpn_sword_01)</label>
                  <input type="text" value={editingItem.id} onChange={e=>setEditingItem({...editingItem, id: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none border border-transparent focus:border-[#2EF2C4] font-mono text-xs"/>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Display Name</label>
                  <input type="text" value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none border border-transparent focus:border-[#2EF2C4]"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Unity Addressable Key</label>
                  <input type="text" value={editingItem.addressableKey} onChange={e=>setEditingItem({...editingItem, addressableKey: e.target.value})} className="w-full bg-[#0E1624] text-[#7A3CFF] p-3 rounded outline-none border border-transparent focus:border-[#7A3CFF] font-mono text-xs"/>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Description</label>
                  <textarea value={editingItem.description} onChange={e=>setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none border border-transparent focus:border-[#2EF2C4] h-20"/>
                </div>
              </div>
            </section>

            {/* GENERAL SETTINGS */}
            <section className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-white/50 text-xs font-black uppercase tracking-widest mb-4">General Settings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Item Type</label>
                  <select value={editingItem.itemType} onChange={e=>setEditingItem({...editingItem, itemType: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none">
                    <option>Equipment</option><option>Consumable</option><option>Material</option><option>Quest</option><option>Trash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Rarity</label>
                  <select value={editingItem.rarity} onChange={e=>setEditingItem({...editingItem, rarity: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none">
                    <option>Common</option><option>Uncommon</option><option>Rare</option><option>Epic</option><option>Legendary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Buy Price (Gold)</label>
                  <input type="number" value={editingItem.buyPrice} onChange={e=>setEditingItem({...editingItem, buyPrice: parseInt(e.target.value)})} className="w-full bg-[#0E1624] text-yellow-400 p-3 rounded outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Sell Price (Gold)</label>
                  <input type="number" value={editingItem.sellPrice} onChange={e=>setEditingItem({...editingItem, sellPrice: parseInt(e.target.value)})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Req. Level</label>
                  <input type="number" value={editingItem.requiredLevel} onChange={e=>setEditingItem({...editingItem, requiredLevel: parseInt(e.target.value)})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Max Stack</label>
                  <input type="number" value={editingItem.maxStack} onChange={e=>setEditingItem({...editingItem, maxStack: parseInt(e.target.value)})} disabled={editingItem.itemType === 'Equipment'} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none disabled:opacity-50"/>
                </div>
                <div>
                  <label className="block text-[10px] text-white/40 uppercase mb-1">Bind Type</label>
                  <select value={editingItem.bindType} onChange={e=>setEditingItem({...editingItem, bindType: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none">
                    <option>None</option><option>BindOnPickup</option><option>BindOnEquip</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" checked={editingItem.isUnique} onChange={e=>setEditingItem({...editingItem, isUnique: e.target.checked})} className="w-4 h-4 accent-[#2EF2C4]"/>
                  <span className="text-xs text-white">Unique</span>
                </div>
              </div>
            </section>

            {/* DYNAMIC SECTION BASED ON TYPE */}
            {editingItem.itemType === 'Equipment' && (
              <section className="bg-[#7A3CFF]/10 p-6 rounded-xl border border-[#7A3CFF]/30">
                <h3 className="text-[#7A3CFF] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Sword size={14}/> Equipment Data</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-1">Slot</label>
                    <select value={editingItem.equipmentSlot} onChange={e=>setEditingItem({...editingItem, equipmentSlot: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none">
                      <option>MainHand</option><option>OffHand</option><option>Head</option><option>Chest</option><option>Legs</option><option>None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-1">Weapon Type</label>
                    <select value={editingItem.weaponType} onChange={e=>setEditingItem({...editingItem, weaponType: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none">
                      <option>None</option><option>Sword</option><option>Axe</option><option>Bow</option><option>Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-1">Armor Type</label>
                    <select value={editingItem.armorType} onChange={e=>setEditingItem({...editingItem, armorType: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none">
                      <option>None</option><option>Cloth</option><option>Leather</option><option>Plate</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" checked={editingItem.isTwoHanded} onChange={e=>setEditingItem({...editingItem, isTwoHanded: e.target.checked})} className="w-4 h-4 accent-[#7A3CFF]"/>
                    <span className="text-xs text-white">Two-Handed</span>
                  </div>
                </div>

                {/* Egyszerűsített Stat Szerkesztő */}
                <h4 className="text-white/50 text-[10px] uppercase font-bold mt-4 mb-2">Base Stats (Flat)</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.keys(editingItem.statsFlat).map(stat => (
                    <div key={stat}>
                       <label className="block text-[10px] text-white/40 uppercase mb-1">{stat}</label>
                       <input type="number" value={editingItem.statsFlat[stat]} onChange={e=>setEditingItem({...editingItem, statsFlat: {...editingItem.statsFlat, [stat]: parseFloat(e.target.value)}})} className="w-full bg-[#0E1624] text-white p-2 rounded outline-none text-center"/>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {editingItem.itemType === 'Consumable' && (
              <section className="bg-red-500/10 p-6 rounded-xl border border-red-500/30">
                <h3 className="text-red-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"><FlaskConical size={14}/> Consumable Data</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-1">Health Restore</label>
                    <input type="number" value={editingItem.healthRestore} onChange={e=>setEditingItem({...editingItem, healthRestore: parseFloat(e.target.value)})} className="w-full bg-[#0E1624] text-green-400 p-3 rounded outline-none"/>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-1">Mana Restore</label>
                    <input type="number" value={editingItem.manaRestore} onChange={e=>setEditingItem({...editingItem, manaRestore: parseFloat(e.target.value)})} className="w-full bg-[#0E1624] text-blue-400 p-3 rounded outline-none"/>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase mb-1">Granted Aura ID</label>
                    <input type="text" value={editingItem.grantedAuraId} onChange={e=>setEditingItem({...editingItem, grantedAuraId: e.target.value})} className="w-full bg-[#0E1624] text-white p-3 rounded outline-none"/>
                  </div>
                </div>
              </section>
            )}

          </div>
        )}
      </div>

    </div>
  );
}