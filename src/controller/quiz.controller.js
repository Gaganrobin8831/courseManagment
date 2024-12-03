const Lesson = require('../models/lesson.models');
const question = require('../models/question.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function handleCreateQuiz(req,res) {
    const { title, lessonId, duration, passThreshold } = req.body;
    const {role} = req.user;

    
    if (!isValidObjectId(lessonId)) {
      return new ResponseUtil({
        success: false,
        message: 'Please Enter Valid lessonId.',
        data: null,
        statusCode: 400,
      }, res)
    }


    if(role != "admin"){
      return new ResponseUtil({
        success: false,
        message: 'Only Admin Can Create Quizes',
        data: null,
        statusCode: 400,
      }, res);
    }

    try {

      const lesonDetail = await Lesson.findOne({lessonId})
      if(!lesonDetail){
        return new ResponseUtil({
          success: false,
          message: 'Lesson Not Found',
          data: null,
          statusCode: 400,
        },res)
      }
      
      const quiz = await Quiz.findOne({title})
      if (quiz) {
        return new ResponseUtil({
          success: false,
          message: 'Quiz Already Exits',
          data: null,
          statusCode: 400,
        }, res);
      }
      const newQuiz = new Quiz({
        title,
        duration,
        passThreshold,
        lessonId
      });
  
      await newQuiz.save();
  
      return new ResponseUtil({
        success: true,
        message: 'Quiz created successfully',
        data: newQuiz,
        statusCode: 201,
      }, res);
    } catch (error) {
      return new ResponseUtil({
        success: false,
        message: 'Error creating quiz',
        data: null,
        statusCode: 500,
        errors: error,
      }, res);
    }
}

async function handleGetQuiz(req, res) {
  try {
    const quizzes = await Quiz.aggregate([
      {
        $lookup: {
          from: 'questions',
          localField: '_id', 
          foreignField: 'quizId',
          as: 'questions'
        }
      },
      {
        $lookup: {
          from: 'lessons', 
          localField: 'lessonId', 
          foreignField: '_id',
          as: 'lesson' 
        }
      },
      {
        $project: {
          title: 1,
          duration: 1,
          passThreshold: 1,
          questions: {
            question: 1,
            options: 1,
            correctAnswer: 1,
            questionType: 1
          },
          lesson: {
            title: 1,
            content: 1,
          }
        }
      }
    ]);

    return new ResponseUtil({
      success: true,
      message: 'Quizzes retrieved successfully with questions and lesson',
      data: quizzes,
      statusCode: 200,
    }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error retrieving quizzes',
      data: null,
      statusCode: 500,
      errors: error,
    }, res);
  }
}

async function handleEditQuiz(req,res) {
    const { id } = req.params;
    const { duration, passThreshold } = req.body;
    const {role} = req.user;

    if (!isValidObjectId(id)) {
      return new ResponseUtil({
        success: false,
        message: 'Please Enter Valid quiz Id.',
        data: null,
        statusCode: 400,
      }, res)
    }

    if(role != "admin"){
      return new ResponseUtil({
        success: false,
        message: 'Only Admin Can Update Quizes',
        data: null,
        statusCode: 400,
      }, res);
    }
  
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(id, {
        duration,
        passThreshold,
      }, { new: true });
  
      if (!updatedQuiz) {
        return new ResponseUtil({
          success: false,
          message: 'Quiz not found',
          data: null,
          statusCode: 404,
        }, res);
      }
  
      return new ResponseUtil({
        success: true,
        message: 'Quiz updated successfully',
        data: updatedQuiz,
        statusCode: 200,
      }, res);
    } catch (error) {
      return new ResponseUtil({
        success: false,
        message: 'Error updating quiz',
        data: null,
        statusCode: 500,
        errors: error,
      }, res);
    }
}

async function handleDeleteQuiz(req, res) {
  const { id } = req.params;
  const { role } = req.user;

  
  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid quiz Id.',
      data: null,
      statusCode: 400,
    }, res);
  }


  if (role !== "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can Delete Quizzes',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
   
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
  
    if (!deletedQuiz) {
      return new ResponseUtil({
        success: false,
        message: 'Quiz not found',
        data: null,
        statusCode: 404,
      }, res);
    }

  
    await question.deleteMany({ quizId: id });
    return new ResponseUtil({
      success: true,
      message: 'Quiz deleted successfully and all related questions and lessons updated',
      data: null,
      statusCode: 200,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Internal server error',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}


module.exports = {
    handleCreateQuiz,
    handleGetQuiz,
    handleEditQuiz,
    handleDeleteQuiz
}