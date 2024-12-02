const express = require('express');
const Quiz = require('../models/quiz.models');
const { checkAuth } = require('../middleware/auth.middleware');
const quizRouter = express.Router();
const  {
  handleCreateQuiz,
  handleGetQuiz,
  handleEditQuiz,
  handleDeleteQuiz
}= require('../controller/quiz.controller')


quizRouter.post('/quizzes', checkAuth,handleCreateQuiz);
quizRouter.get('/quizzes', checkAuth,handleGetQuiz);
quizRouter.put('/quizzes/:id', checkAuth, handleEditQuiz);
quizRouter.delete('/quizzes/:id', checkAuth, handleDeleteQuiz);


module.exports = quizRouter;
