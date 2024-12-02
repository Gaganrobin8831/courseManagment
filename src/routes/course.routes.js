const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseProgress,
} = require('../controller/course.controller');
const { checkAuth } = require('../middleware/auth.middleware');

const courseRouter = express.Router();


courseRouter.route('/courses').post( checkAuth, createCourse); 
courseRouter.route('/getCourseProgress').post( checkAuth, getCourseProgress); 
courseRouter.route('/courses').get( checkAuth, getAllCourses); 
courseRouter.route('/courses/:id').get( checkAuth, getCourseById); 
courseRouter.route('/courses/:id').put( checkAuth, updateCourse); 
courseRouter.route('/courses/:id').delete( checkAuth, deleteCourse); 

module.exports = courseRouter;
