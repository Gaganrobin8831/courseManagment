const { auth } = require('../models/auth.models');
const Lesson = require('../models/lesson.models');
const { Progress } = require('../models/progress.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);

}

async function handleStudentDetail(req, res) {
  const { id } = req.body;

  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid studentId.',
      data: null,
      statusCode: 400,
    }, res)
  }
  try {

    const student = await auth.findOne({ _id: id })
      .select("name _id email")
      .populate({
        path: 'Courses',
        populate: {
          path: 'lessons',
          model: 'Lesson',
          populate: {
            path: 'quiz',
            model: 'Quiz',
            populate: {
              path: 'questions',
              model: 'Question'
            }
          }
        }
      });

    return new ResponseUtil({
      success: true,
      message: 'Successfully fetched question details',
      data: question,
      statusCode: 200,
    }, res);

  } catch (error) {
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
  const { questionId, lessonId } = req.body;
  
  if (!isValidObjectId(questionId) || !isValidObjectId(lessonId) ) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid questionId or lessonId.',
      data: null,
      statusCode: 400,
    }, res)
  }

  try {

    const lesson = await Lesson.findById(lessonId).populate({
      path: 'quiz',
      model: 'Quiz',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    });

    if (!lesson) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson not found',
        data: null,
        statusCode: 404,
      }, res);
    }


    let progress = await Progress.findOne({ questionId, lessonId });

    if (!progress) {
      progress = new Progress({
        questionId,
        lessonId,
        score: 0,
        status: 'not_started',
      });
      await progress.save();
    }

    return new ResponseUtil({
      success: true,
      message: 'Lesson and quizzes fetched, and progress created successfully',
      data: {
        lessonTitle: lesson.title,
        lessonContent: lesson.content,
        quizzes: lesson.quiz,
        progressStatus: progress.status,
      },
      statusCode: 200,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Internal server error',
      data: null,
      statusCode: 500,
      errors: error.message || error,
    }, res);
  }
}

async function handleSubmitQuiz(req, res) {
  const { lessonId } = req.params;
  const { answers, questionId } = req.body;

  if (!isValidObjectId(lessonId) ) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid lessonId.',
      data: null,
      statusCode: 400,
    }, res)
  }
  try {

    const lesson = await Lesson.findById(lessonId).populate({
      path: 'quiz',
      model: 'Quiz',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    });

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


    let progress = await Progress.findOne({ questionId, quizId: quiz._id, lessonId });

    if (!progress) {
      progress = new Progress({
        questionId,
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