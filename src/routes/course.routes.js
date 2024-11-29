const express = require('express');
const Course = require('../models/course.models');
const { checkAuth } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/courses', checkAuth, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCourse = new Course({ name, description, createdBy: req.user._id });
    await newCourse.save();
     
    return new ResponseUtil({
        success: false,
        message: 'Success',
        data: newCourse,
        statusCode: 201,
    }, res);

  } catch (error) {
    return new ResponseUtil({
        success: false,
        message: 'Error creating course',
        data: null,
        statusCode: 500,
        errors:error
    }, res);
  }
});

module.exports = router;
