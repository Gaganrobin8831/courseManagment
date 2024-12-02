const express = require('express');
const adminRouter = express.Router();
const { checkAuth } = require('../middleware/auth.middleware');
const { handleGetReportsStudents, handleAssignCourses, handleAssignQuizToLesson, handleAssignLessonToCourses } = require('../controller/admin.controller');


adminRouter.post('/assign-course', checkAuth, handleAssignCourses);
adminRouter.post('/assign-lesson', checkAuth, handleAssignLessonToCourses);
adminRouter.post('/assign-quiz', checkAuth, handleAssignQuizToLesson);
adminRouter.get('/students/reports', checkAuth,handleGetReportsStudents);

module.exports = adminRouter;
