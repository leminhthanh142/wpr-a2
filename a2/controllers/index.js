const mongoose = require('mongoose')
const Questions =  require('../models/question')
const Attempt = require('../models/attempt')

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Questions.aggregate([{ $sample: { size: 10 }}])

        // remove correctAnswer in each question
        const newQuestions = []
        questions.forEach((question) => newQuestions.push({
            _id: question._id,
            text: question.text,
            answers: question.answers
        }))

        const correctAnswers = {}
        questions.forEach((question) => correctAnswers[question._id] = Number(question.correctAnswer))

        const attempt = new Attempt({
            _id: new mongoose.Types.ObjectId(),
            questions: newQuestions,
            completed: false,
            startedAt: new Date(),
            correctAnswers,
            answers: {},
            score: 0,
            scoreText: '',
        })
        await attempt.save()

        return res.status(201).json({
            _id: attempt._id,
            questions: attempt.questions,
            startedAt: attempt.startedAt,
            completed: false,
        })
    }
    catch (error) {
        return res.status(500).json("error", { error })
    }
}

exports.submitQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        const answers = req.body.answers;
        let score = 0;
        let scoreText = '';

        // find the quiz
        const attempt = await Attempt.findById(id).exec()

        // destructuring
        const { correctAnswers, completed } = attempt
        if (completed) return res.status(200).json(attempt)

        // compute score
        Object.keys(answers).forEach((key) => {
            if (Number(correctAnswers[key]) === Number(answers[key])) {
                score++
            }
        })

        // compute scoreText
        if (score < 5) scoreText = 'Practice more to improve it :D'
        else if (score < 7) scoreText = 'Good, keep up'
        else if (score < 9) scoreText = 'Well done!'
        else scoreText = 'Perfect'

        await attempt.updateOne({
            completed: true,
            score,
            scoreText,
            answers,
        })
        const result = {
            _id: attempt._id,
            questions: attempt.questions,
            completed: true,
            answers,
            startedAt: attempt.startedAt,
            score,
            scoreText,
            correctAnswers: attempt.correctAnswers
        }
        return res.status(200).json(result)
    }
    catch (err) {
        return res.status(500).json("error", { err })
    }
}
