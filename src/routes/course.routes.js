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

//create course using { name, description } 
courseRouter.route('/courses').post( checkAuth, createCourse); 

//get course progress { studentId, courseId }
courseRouter.route('/getCourseProgress').post( checkAuth, getCourseProgress); 

// get all courses using auth
courseRouter.route('/courses').get( checkAuth, getAllCourses); 
//get course by coursId  const { id } = req.params;
courseRouter.route('/courses/:id').get( checkAuth, getCourseById); 

// update course by id  const { id } = req.params; and using  { description } and auth
courseRouter.route('/courses/:id').put( checkAuth, updateCourse); 

// delete course by id  const { id } = req.params; and auth
courseRouter.route('/courses/:id').delete( checkAuth, deleteCourse); 

module.exports = courseRouter;
