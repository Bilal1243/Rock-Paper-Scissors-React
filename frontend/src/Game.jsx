import React, { useState } from 'react';
import axios from 'axios';
import './Game.css'
import {useNavigate} from 'react-router-dom'
import { useGameContext } from './gameStore';

function App() {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [player1Choice, setPlayer1Choice] = useState(null);
    const [player2Choice, setPlayer2Choice] = useState(null);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [roundWinner, setRoundWinner] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [userEntered, setUser] = useState(false);
    const [round, setRound] = useState(1)
    const [ended, setEnd] = useState(false)
    const [finalWinner, setFinal] = useState('')

    const {setId} = useGameContext()

    const navigate = useNavigate()

    const decision = async (player, choice) => {
        if (player === 'player1') {
            setPlayer1Choice(choice);
        } else {
            setPlayer2Choice(choice);
        }
    };

    const startGame = async () => {
        if (player1.trim() && player2.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/api/startGame', { player1, player2 });
                setGameId(response.data.gameId);
                setId(gameId)
                setUser(true);
            } catch (error) {
                console.error('Error starting game:', error.message);
            }
        } else {
            alert('Please enter valid names for both players.');
        }
    };

    const determineRoundWinner = async () => {
        let winner;
        if (player1Choice === player2Choice) {
            winner = 'TIE';
        } else if (
            (player1Choice === 'ROCK' && player2Choice === 'SCISSORS') ||
            (player1Choice === 'PAPER' && player2Choice === 'ROCK') ||
            (player1Choice === 'SCISSORS' && player2Choice === 'PAPER')
        ) {
            winner = player1;
            setPlayer1Score((prevScore) => prevScore + 1);
        } else {
            winner = player2;
            setPlayer2Score((prevScore) => prevScore + 1);
        }
        setRoundWinner(winner);

        
        if (gameId) {
            try {
                await axios.post(`http://localhost:5000/api/recordRound/${gameId}`, {
                    winner,
                    player1Choice,
                    player2Choice,
                });
            } catch (error) {
                console.error('Error recording round:', error.message);
            }
        }
    };

    const handleLock = () => {
        if (round === 7) {
            if (player1Score > player2Score) {
                setFinal(player1)
            }
            else if(player1Score === player2Score){
                setFinal('Tie')
            }
            else {
                setFinal(player2)
            }
            setEnd(true)
        }
        else {
            determineRoundWinner()
            setRound(round + 1)
        }
    };

    const loadGameData = ()=>{
        setId(gameId)
        navigate('/loadGameData')
    }

    return (
        <div className="App">
            {
                ended ?
                <>
                {finalWinner === 'Tie' ? (
                  <h1>Game is {finalWinner}</h1>
                ) : (
                  <div>
                    <h1>Game Winner: {finalWinner}</h1>
                  </div>
                )}
                <div className='btn-container'><button onClick={() => { window.location.reload() }} className='newgame'>Start Over</button></div>
                <div className='btn-container'><button onClick={() => { loadGameData() }} className='newgame'>History</button></div>
              </>
              
                    :
                    <>
                        {userEntered ? (
                            <div className='options-container'>
                                <div className='left-side'>
                                <h1>Current Round : {round}</h1>
                                    <div className='options'>
                                        <p>{player1}'s Turn:</p>
                                        <button onClick={() => decision('player1', 'ROCK')}><i className={`fas fa-hand-rock`} /></button>
                                        <button onClick={() => decision('player1', 'PAPER')}><i className={`fas fa-hand-paper`} /></button>
                                        <button onClick={() => decision('player1', 'SCISSORS')}><i className={`fas fa-hand-scissors`} /></button>
                                    </div>
                                    <div className='options'>
                                        <p>{player2}'s Turn:</p>
                                        <button onClick={() => decision('player2', 'ROCK')}><i className={`fas fa-hand-rock`} /></button>
                                        <button onClick={() => decision('player2', 'PAPER')}><i className={`fas fa-hand-paper`} /></button>
                                        <button onClick={() => decision('player2', 'SCISSORS')}><i className={`fas fa-hand-scissors`} /></button>
                                    </div>
                                    <p>{player1}'s choice: {player1Choice}</p>
                                    <p>{player2}'s choice: {player2Choice}</p>
                                    <button onClick={handleLock}>Show Round Result</button>
                                </div>
                                <div className="content">
                                    <h2>Round Winner: {roundWinner}</h2>
                                    <h2>{player1}'s Score: {player1Score}</h2>
                                    <h2>{player2}'s Score: {player2Score}</h2>
                                </div>
                            </div>
                        ) : (
                            <div className='login-container'>
                                <h1>Rock Paper Scissors Game</h1>
                                <div>
                                <input type="text" value={player1} onChange={(e) => setPlayer1(e.target.value)} placeholder="player1 name" />
                                </div>
                                <div>
                                <input type="text" value={player2} onChange={(e) => setPlayer2(e.target.value)} placeholder="player2 name" />
                                </div>
                                <button onClick={startGame}>Start Game</button>
                                <p>There will be only six rounds so be carefull..</p>
                            </div>
                        )}
                    </>
            }
        </div>
    );
}

export default App;
