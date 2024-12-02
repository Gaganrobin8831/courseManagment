const Lesson = require('../models/lesson.models');
const {Progress} = require('../models/progress.models');
const ResponseUtil = require('../utility/respone.utility'); 

async function getLessonCompletion(req, res) {
  const {studentId, lessonId} = req.body
  try {
    
    const lesson = await Lesson.findById(lessonId).populate('quiz');
    // console.log(lesson.quiz);
    // let quizId = lesson.quiz._id
    
    if (!lesson) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    const totalQuizzes = lesson.quiz.length;

    if (totalQuizzes === 0) {
      return new ResponseUtil({
        success: true,
        message: 'No quizzes in this lesson',
        data: {
          status: 'no_quiz',
          completionPercentage: 0
        },
        statusCode: 200,
      }, res);
    }

    const progress = await Progress.find({ studentId, lessonId }).populate('quizId');
   console.log({progress})
    const completedQuizzes = progress.filter(p => p.status === 'completed').length;


    const completionPercentage = (completedQuizzes / totalQuizzes) * 100;

   
    let lessonStatus = 'not_started';
    if (completedQuizzes === totalQuizzes) {
      lessonStatus = 'completed';
    } else if (completedQuizzes > 0) {
      lessonStatus = 'in_progress';
    }

    return new ResponseUtil({
      success: true,
      message: 'Lesson completion details fetched successfully',
      data: {
        status: lessonStatus,
        completionPercentage: Math.round(completionPercentage)
      },
      statusCode: 200,
    }, res);

  } catch (error) {
    console.error('Error calculating lesson completion:', error);
    return new ResponseUtil({
      success: false,
      message: 'Error calculating lesson completion',
      data: null,
      statusCode: 500,
      errors: error,
    }, res);
  }
};

module.exports = { getLessonCompletion };
