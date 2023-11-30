import React, { createContext, useContext, useState } from 'react';


const GameContext = createContext();


export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameId, setGameId] = useState(null);
  const setId = (id) => {
    setGameId(id);
  };

  return (
    <GameContext.Provider value={{ gameId, setId }}>
      {children}
    </GameContext.Provider>
  );
};
