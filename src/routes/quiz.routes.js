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

// Create a new quiz using  const { title, questions, duration, passThreshold } = req.body;
quizRouter.post('/quizzes', checkAuth,handleCreateQuiz);

// Get all quizzes
quizRouter.get('/quizzes', checkAuth,handleGetQuiz);

// Update a quiz using id and   const { questions, duration, passThreshold } = req.body; and auth
quizRouter.put('/quizzes/:id', checkAuth, handleEditQuiz);

// Delete a quiz using paramas id and remove its reference from all lessons
quizRouter.delete('/quizzes/:id', checkAuth, handleDeleteQuiz);


module.exports = quizRouter;
