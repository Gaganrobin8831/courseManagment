const { auth } = require('../models/auth.models');
const { Progress } = require('../models/progress.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

async function handleStudentDetail(req,res) {
    // const {id} = req.user
    const {id} = req.body
    try{
        
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

    }catch(error){
        console.error(error);
        return new ResponseUtil({
            success: false,
            message: 'Error Occurred',
            data: null,
            statusCode: 500,
            errors: error.message || error,
        }, res);
    }
}

async function handlePlayQuiz(req, res) {
    const { quizId } = req.params;  
    const { studentId } = req.user; 
  
    try {
   
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return new ResponseUtil({
          success: false,
          message: 'Quiz not found',
          data: null,
          statusCode: 404,
        }, res);
      }
  
   
      let progress = await Progress.findOne({ studentId, quizId });
      if (!progress) {

        progress = new Progress({
          studentId,
          quizId,
          status: 'not_started',
          score: 0,
        });
        await progress.save();
      }
  
     
      return new ResponseUtil({
        success: true,
        message: 'Quiz fetched successfully',
        data: {
          title: quiz.title,
          questions: quiz.questions, 
          duration: quiz.duration,
        },
        statusCode: 200,
      }, res);
  
    } catch (error) {
      return new ResponseUtil({
        success: false,
        message: 'Error retrieving quiz',
        data: null,
        statusCode: 500,
        errors: error,
      }, res);
    }
  }
  
 
async function handleSubmitQuiz(req, res) {
    const { quizId } = req.params;
    const { studentId } = req.user;
    const { answers } = req.body; // answers: { questionId: answer }
  
    try {
      // Step 1: Fetch the quiz to validate its structure
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return new ResponseUtil({
          success: false,
          message: 'Quiz not found',
          data: null,
          statusCode: 404,
        }, res);
      }
  
      // Step 2: Find the student's progress
      let progress = await Progress.findOne({ studentId, quizId });
      if (!progress) {
        return new ResponseUtil({
          success: false,
          message: 'Student has not started the quiz',
          data: null,
          statusCode: 400,
        }, res);
      }
  
      // Step 3: Calculate the score based on the student's answers
      let score = 0;
      const correctAnswers = quiz.questions.map(q => q.correctAnswer);
      const totalQuestions = quiz.questions.length;
  
      // Compare the student's answers with the correct answers
      quiz.questions.forEach((question, index) => {
        if (answers[question._id] === correctAnswers[index]) {
          score++;
        }
      });
  
      // Step 4: Update the student's progress with their score
      progress.score = score;
      progress.status = score >= quiz.passThreshold ? 'completed' : 'in_progress';
      await progress.save();
  
      // Step 5: Return the results to the student
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
        errors: error,
      }, res);
    }
  }
  
module.exports = {
    handleStudentDetail,
    handlePlayQuiz,
    handleSubmitQuiz
}