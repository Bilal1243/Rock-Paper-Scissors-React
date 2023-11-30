const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    player1: String,
    player2: String,
    rounds: [{ winner: String, player1Choice: String, player2Choice: String }]
})

module.exports = mongoose.model('GameData',gameSchema)