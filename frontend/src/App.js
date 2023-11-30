import React from 'react';
import Game from './Game.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AllGames from './AllGames.jsx';
import { GameProvider } from './gameStore.js';

function App() {
  return (
    <div>
      <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Game></Game>}></Route>
          <Route path='/loadGameData' element={<AllGames></AllGames>}></Route>
        </Routes>
      </BrowserRouter>
      </GameProvider>
    </div>
  );
}

export default App;
