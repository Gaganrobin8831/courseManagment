const question = require('../models/question.models');

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
  

async function createquestion(req, res) {
  const { quizId, questions, options, correctAnswer, questionType } = req.body;

  
  if (!isValidObjectId(quizId)) {
    return new ResponseUtil({
      success: false,
      message: 'Invalid quiz ID.',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
    
    const newquestion = new question({
      quizId,
      questions,
      options,
      correctAnswer,
      questionType,
    });

    
    await newquestion.save();

    return new ResponseUtil({
      success: true,
      message: 'question created successfully',
      data: newquestion,
      statusCode: 201,
    }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error creating question',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}


async function getAllquestions(req, res) {
  try {
    
    const questions = await question.find().populate('quizId', 'title');

    return new ResponseUtil({
      success: true,
      message: 'questions fetched successfully',
      data: questions,
      statusCode: 200,
    }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error fetching questions',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}


async function getquestionById(req, res) {
  const { id } = req.params;

 
  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Invalid question ID.',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
   
    const questions = await question.findById(id).populate('quizId', 'title');

    if (!questions) {
      return new ResponseUtil({
        success: false,
        message: 'question not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    return new ResponseUtil({
      success: true,
      message: 'question fetched successfully',
      data: questions,
      statusCode: 200,
    }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error fetching question',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}


async function updatequestion(req, res) {
  const { id } = req.params;
  const { questions, options, correctAnswer, questionType } = req.body;


  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Invalid question ID.',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
    
    const updatedquestion = await question.findByIdAndUpdate(
      id,
      { questions, options, correctAnswer, questionType },
      { new: true } 
    );

    if (!updatedquestion) {
      return new ResponseUtil({
        success: false,
        message: 'question not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    return new ResponseUtil({
      success: true,
      message: 'question updated successfully',
      data: updatedquestion,
      statusCode: 200,
    }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error updating question',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}


async function deletequestion(req, res) {
  const { id } = req.params;

 
  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Invalid question ID.',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
    const deletedquestion = await question.findByIdAndDelete(id);

    if (!deletedquestion) {
      return new ResponseUtil({
        success: false,
        message: 'question not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    return new ResponseUtil({
      success: true,
      message: 'question deleted successfully',
      data: null,
      statusCode: 200,
    }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error deleting question',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}

module.exports = {
  createquestion,
  getAllquestions,
  getquestionById,
  updatequestion,
  deletequestion
};
