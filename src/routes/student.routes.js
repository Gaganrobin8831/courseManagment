const express = require('express');
const studentRouter = express.Router();
const { checkAuth } = require('../middleware/auth.middleware');
const { handleStudentDetail } = require('../controller/student.controller');

studentRouter.route('/studentDetail').get(handleStudentDetail)

module.exports = studentRouter;
