const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(`${process.env.MONGOURL}TwoPlayerGame`);

const GameData = require('./Model/gameSchema')


// API endpoint to start a new game
app.post('/api/startGame', async (req, res) => {
    const { player1, player2 } = req.body;

    const newGame = new GameData({
        player1,
        player2,
        rounds: [],
    });

    await newGame.save();

    res.json({ message: 'Game started successfully', gameId: newGame._id });
});

// API endpoint to record a round
app.post('/api/recordRound/:gameId', async (req, res) => {
    const { gameId } = req.params;
    const { winner, player1Choice, player2Choice } = req.body;

    try {
        const game = await GameData.findById(gameId);

        game.rounds.push({ winner, player1Choice, player2Choice });
        await game.save();

        res.json({ message: 'Round recorded successfully', game });
    } catch (error) {
        res.status(500).json({ error: 'Error recording round' });
    }
});


// API endpoint to get all games
app.get('/api/allGames', async (req, res) => {
    try {
        const id = req.query.id;
        
        const games = await GameData.findOne({ _id: id });

        if (!games) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json({ games });
    } catch (error) {
        console.error('Error fetching games:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
