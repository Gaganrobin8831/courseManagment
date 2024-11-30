const express = require('express');
const adminRouter = express.Router();
const { checkAuth } = require('../middleware/auth.middleware');
const { handleGetReportsStudents, handleAssignCourses } = require('../controller/admin.controller');


adminRouter.post('/assign-course', checkAuth, handleAssignCourses);

// Generate reports for all students
adminRouter.get('/admin/reports', checkAuth,handleGetReportsStudents);

module.exports = adminRouter;
