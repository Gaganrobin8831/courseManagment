const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controller/course.controller');
const { checkAuth } = require('../middleware/auth.middleware');

const courseRouter = express.Router();


courseRouter.post('/courses', checkAuth, createCourse); 
courseRouter.get('/courses', checkAuth, getAllCourses); 
courseRouter.get('/courses/:id', checkAuth, getCourseById); 
courseRouter.put('/courses/:id', checkAuth, updateCourse); 
courseRouter.delete('/courses/:id', checkAuth, deleteCourse); 

module.exports = courseRouter;
