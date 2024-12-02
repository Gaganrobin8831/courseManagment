const { auth } = require('../models/auth.models');
const Lesson = require('../models/lesson.models');
const { Progress } = require('../models/progress.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

async function handleStudentDetail(req, res) {
  // const {id} = req.user
  const { id } = req.body
  try {

    const student = await auth
      .findOne({ _id: id })
      .select("name _id email")
      .populate({
        path: 'Courses',
        populate: {
          path: 'lessons',
          model: 'Lesson',
        }
      });
    return new ResponseUtil({
      success: true,
      message: 'Successfully',
      data: student,
      statusCode: 200,

    }, res);

  } catch (error) {
    console.error(error);
    return new ResponseUtil({
      success: false,
      message: 'Internal server error',
      data: null,
      statusCode: 500,
      errors: error.message || error,
    }, res);
  }
}

async function handlePlayQuiz(req, res) {
  // const { quizId } = req.params;
  const { studentId, lessonId } = req.body;

  try {

    const lesson = await Lesson.findById(lessonId).populate('quiz');
    // const lesson = await Lesson.findById(lessonId)
    // console.log({lesson});
    
    if (!lesson) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson not found',
        data: null,
        statusCode: 404,
      }, res);
    }


    let progress = await Progress.findOne({ studentId, lessonId });


    if (!progress) {
      progress = new Progress({
        studentId,
        lessonId,
        score: 0,
        status: 'not_started',
      });
      await progress.save();
    }


    return new ResponseUtil({
      success: true,
      message: 'Lesson and quizzes fetched and create progress successfully',
      data: {
        lessonTitle: lesson.title,
        lessonContent: lesson.content,
        quizzes: lesson.quiz,
        progressStatus: progress.status,
      },
      statusCode: 200,
    }, res);



  } catch (error) {
    console.log(error)
    return new ResponseUtil({
      success: false,
      message: 'Internal server error',
      data: null,
      statusCode: 500,
      errors: error,
    }, res);
  }
}

async function handleSubmitQuiz(req, res) {
  const { lessonId } = req.params;
  const { answers, studentId } = req.body;

  try {
 
    const lesson = await Lesson.findById(lessonId).populate('quiz');

    if (!lesson) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    const quiz = lesson.quiz[0]; 

    if (!quiz) {
      return new ResponseUtil({
        success: false,
        message: 'Quiz not found for this lesson',
        data: null,
        statusCode: 404,
      }, res);
    }

    
    let progress = await Progress.findOne({ studentId, quizId: quiz._id });

    if (!progress) {
    
      progress = new Progress({
        studentId,
        quizId: quiz._id,
        lessonId,
        score: 0,
        status: 'not_started',  
      });
      await progress.save();
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

   
    quiz.questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score++;
      }
    });

    const percentageScore = (score / totalQuestions) * 100;

   
    if (percentageScore >= quiz.passThreshold) {
      progress.status = 'completed';
    } else {
      progress.status = 'in_progress';
    }

    
    progress.score = score;
    await progress.save();

    return new ResponseUtil({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        totalQuestions,
        status: progress.status,
        passThreshold: quiz.passThreshold,
      },
      statusCode: 200,
    }, res);

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return new ResponseUtil({
      success: false,
      message: 'Error submitting quiz',
      data: null,
      statusCode: 500,
      errors: error.message || error,
    }, res);
  }
}

module.exports = {
  handleStudentDetail,
  handlePlayQuiz,
  handleSubmitQuiz
}