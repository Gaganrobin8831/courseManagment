const express = require('express');
const Quiz = require('../models/Quiz');
const { checkAuth } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/quizzes',checkAuth, async (req, res) => {
  const { title, questions, duration, passThreshold } = req.body;

  try {
    const newQuiz = new Quiz({ title, questions, duration, passThreshold });
    await newQuiz.save();
    
    return new ResponseUtil({
        success: false,
        message: 'Course assigned to student successfully',
        data: newQuiz,
        statusCode: 201,
    }, res);
  } catch (error) {
    return new ResponseUtil({
        success: false,
        message: 'Error creating quiz',
        data: null,
        statusCode: 500,
        errors:error
    }, res);
  }
});

module.exports = router;
