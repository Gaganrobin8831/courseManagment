const mongoose = require('mongoose');
const Lesson = require('../models/lesson.models');
const Progress = require('../models/progress.models');
const Quiz = require('../models/quiz.models');

const getLessonCompletion = async (studentId, lessonId) => {
  try {
    // Step 1: Get all quizzes related to the lesson
    const lesson = await Lesson.findById(lessonId).populate('quiz');
    const totalQuizzes = lesson.quiz.length;

    if (totalQuizzes === 0) {
      return {
        status: 'no_quiz',  // If there are no quizzes for the lesson
        completionPercentage: 0
      };
    }

    // Step 2: Get progress of the student for each quiz in this lesson
    const progress = await Progress.find({ studentId, lessonId }).populate('quizId');

    // Step 3: Count completed quizzes
    const completedQuizzes = progress.filter(p => p.status === 'completed').length;

    // Step 4: Calculate completion percentage
    const completionPercentage = (completedQuizzes / totalQuizzes) * 100;

    // Step 5: Determine the overall lesson status
    let lessonStatus = 'not_started';
    if (completedQuizzes === totalQuizzes) {
      lessonStatus = 'completed';
    } else if (completedQuizzes > 0) {
      lessonStatus = 'in_progress';
    }

    return {
      status: lessonStatus,
      completionPercentage: Math.round(completionPercentage)
    };
  } catch (error) {
    console.error('Error calculating lesson completion:', error);
    throw error;
  }
};


module.exports = { getLessonCompletion };
