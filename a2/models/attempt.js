const mongoose = require('mongoose')

// schema --> skeleton
// entity --> dbs
const AttemptSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    questions: [],
    startedAt: Date,
    completed: Boolean,
    correctAnswers: {},
    answers: {},
    score: Number,
    scoreText: String,
    // attributes
})

module.exports = new mongoose.model("attempts", AttemptSchema)
