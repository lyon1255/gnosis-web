import React, { useEffect, useState } from 'react';
import ItemEditorPage from '../components/admin/ItemEditorPage';
import { hydrateGameData, loadCachedGameData, saveCachedGameData } from '../components/admin/gameDataSync';

export default function ItemEditor() {
  const [gameData, setGameData] = useState(() => hydrateGameData(loadCachedGameData()));

  useEffect(() => {
    saveCachedGameData(gameData);
  }, [gameData]);

  return <ItemEditorPage data={gameData} onDataChange={setGameData} />;
}
