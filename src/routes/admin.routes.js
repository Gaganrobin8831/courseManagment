const express = require('express');
const adminRouter = express.Router();
const { checkAuth } = require('../middleware/auth.middleware');
const { handleGetReportsStudents, handleAssignCourses, handleAssignQuizToLesson, handleAssignLessonToCourses } = require('../controller/admin.controller');

//assign course to student using  { studentId, courseId }
adminRouter.post('/assign-course', checkAuth, handleAssignCourses);

//assign lesson to course using { lessonId, courseId }
adminRouter.post('/assign-lesson', checkAuth, handleAssignLessonToCourses);

//assign quiz to lesson using { lessonId, quizId }
adminRouter.post('/assign-quiz', checkAuth, handleAssignQuizToLesson);

// Generate reports for all students
adminRouter.get('/admin/reports', checkAuth,handleGetReportsStudents);

module.exports = adminRouter;
