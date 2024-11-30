const Lesson = require('../models/lesson.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

async function handleCreateQuiz(req,res) {
    const { title, questions, duration, passThreshold } = req.body;

    try {
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
        questions,
        duration,
        passThreshold,
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

async function handleGetQuiz(req,res) {
    try {
        const quizzes = await Quiz.find();
        
        return new ResponseUtil({
          success: true,
          message: 'Quizzes retrieved successfully',
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
    const { questions, duration, passThreshold } = req.body;
  
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(id, {
        questions,
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

async function handleDeleteQuiz(req,res) {
    const { id } = req.params;

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
  
      s
      await Lesson.updateMany(
        { quiz: id }, 
        { $set: { quiz: null } } 
      );
  
      return new ResponseUtil({
        success: true,
        message: 'Quiz deleted and references removed from lessons successfully',
        data: null,
        statusCode: 200,
      }, res);
    } catch (error) {
      return new ResponseUtil({
        success: false,
        message: 'Error deleting quiz or removing references from lessons',
        data: null,
        statusCode: 500,
        errors: error,
      }, res);
    } 
}

module.exports = {
    handleCreateQuiz,
    handleGetQuiz,
    handleEditQuiz,
    handleDeleteQuiz
}