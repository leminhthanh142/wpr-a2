const mongoose = require('mongoose')

const QuestionsSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    answers: [],
    text: String,
    correctAnswer: Number
})

module.exports = new mongoose.model('questions', QuestionsSchema)
