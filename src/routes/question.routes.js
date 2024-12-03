const express = require('express')
const questionRouter = express.Router()
const {
    createquestion,
    getAllquestions,
    getquestionById,
    updatequestion,
    deletequestion
  } = require('../controller/question.controller')
const { checkAuth } = require('../middleware/auth.middleware')


questionRouter.route('/question').post(checkAuth,createquestion)
questionRouter.route('/question').get(checkAuth,getAllquestions)
questionRouter.route('/question/:id').get(checkAuth,getquestionById)
questionRouter.route('/question/:id').put(checkAuth,updatequestion)
questionRouter.route('/question/:id').delete(checkAuth,deletequestion)
module.exports = questionRouter