const express = require('express');
const studentRouter = express.Router();
// const { checkAuth } = require('../middleware/auth.middleware');
const { handleStudentDetail, handlePlayQuiz, handleSubmitQuiz } = require('../controller/student.controller');
const { getLessonCompletion } = require('../controller/progress.controller');

studentRouter.route('/studentDetail').get(handleStudentDetail)
studentRouter.route('/playQuiz/:quizId').post(handlePlayQuiz)
studentRouter.route('/submitQuiz/:lessonId').post(handleSubmitQuiz)
studentRouter.route('/lessonCompletion').get(getLessonCompletion)


module.exports = studentRouter;
