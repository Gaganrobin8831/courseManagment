const express = require('express');
const studentRouter = express.Router();
// const { checkAuth } = require('../middleware/auth.middleware');
const { handleStudentDetail, handlePlayQuiz, handleSubmitQuiz } = require('../controller/student.controller');
const { getLessonCompletion } = require('../controller/progress.controller');

//get full student detail student id using { id } 
studentRouter.route('/studentDetail').get(handleStudentDetail)
// student quiz detail { studentId, lessonId } 
studentRouter.route('/playQuiz').post(handlePlayQuiz)
// submit quiz const { lessonId } = req.params { answers, studentId } = req.body;
studentRouter.route('/submitQuiz/:lessonId').post(handleSubmitQuiz)

// progress detail of lesson   const {studentId, lessonId} = req.body
studentRouter.route('/lessonCompletion').get(getLessonCompletion)


module.exports = studentRouter;
