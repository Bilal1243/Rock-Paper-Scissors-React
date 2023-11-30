import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGameContext } from './gameStore';
import { useNavigate } from 'react-router-dom';
import './AllGames.css'

function AllGames() {
  const { gameId } = useGameContext();
  const [game, setGame] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:5000/api/allGames?id=${gameId}`);
        console.log('All games:', response.data.games);
        setGame(response.data.games);
      } catch (error) {
        console.error('Error fetching games:', error.message);
      }
    }

    fetchData();
  }, [gameId]);

  return (
    <div className="game-details">
      {game ? (
        <>
          <div className="details-item">
            <span className="details-label">Game ID:</span>
            <span className="details-value">{game._id}</span>
          </div>
          <div className="details-item">
            <span className="details-label">Player 1:</span>
            <span className="details-value">{game.player1}</span>
          </div>
          <div className="details-item">
            <span className="details-label">Player 2:</span>
            <span className="details-value">{game.player2}</span>
          </div>
          <button onClick={()=>{navigate('/')}}>New Game</button>

          {/* Displaying rounds if available */}
          {game.rounds && game.rounds.length > 0 && (
            <div className="rounds-container">
              <span className="details-label">Rounds:</span>
              {game.rounds.map((round, index) => (
                <div key={index} className="round">
                  <div>
                    <span className="round-label">Round {index + 1}:</span>
                  </div>
                  <div>
                    <span className="details-label">Winner:</span>
                    <span className="details-value">{round.winner}</span>
                  </div>
                  <div>
                    <span className="details-label">Player 1 Choice:</span>
                    <span className="details-value">{round.player1Choice}</span>
                  </div>
                  <div>
                    <span className="details-label">Player 2 Choice:</span>
                    <span className="details-value">{round.player2Choice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AllGames;
