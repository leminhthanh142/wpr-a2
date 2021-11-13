const mongoose = require('mongoose')
const Questions =  require('../models/question')
const Attempt = require('../models/attempt')

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Questions.aggregate([{ $sample: { size: 10 }}])

        // save correctAnswers
        const correctAnswers = {}
        questions.forEach((question) => correctAnswers[question._id] = Number(question.correctAnswer))

        // remove correctAnswer in each question
        questions.map((question) => delete question.correctAnswer)

        // create new attempt
        const attempt = new Attempt({
            _id: new mongoose.Types.ObjectId(),
            questions,
            completed: false,
            startedAt: new Date(),
            correctAnswers,
            answers: {},
            score: 0,
            scoreText: '',
        })

        // save attempt to DB
        await attempt.save()

        // return attempt to user
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

        // check if attempt is already completed
        // --> if yes then return attempt only, no further update
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

        // update attempt
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
