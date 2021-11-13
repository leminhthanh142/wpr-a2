const express = require('express')
const router = express.Router()
const { getQuestions, submitQuiz } = require('../controllers')

router.post('/attempts', getQuestions)
router.post('/attempts/:id/submit', submitQuiz)
module.exports = router
