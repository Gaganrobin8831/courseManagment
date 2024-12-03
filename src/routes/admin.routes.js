const express = require('express');
const adminRouter = express.Router();
const { checkAuth } = require('../middleware/auth.middleware');
const { handleGetReportsStudents, handleAssignCourses } = require('../controller/admin.controller');


adminRouter.post('/assign-course', checkAuth, handleAssignCourses);

adminRouter.get('/students/reports', checkAuth,handleGetReportsStudents);

module.exports = adminRouter;
