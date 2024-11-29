const mongoose = require('mongoose')
const quizSchema = new mongoose.Schema({
    title: {
         type: String,
         required: true
    },
    questions: [
        {
      question: { 
        type: String,
         required: true
        },
      options: [
        {
         type: String 
        }
    ],
      correctAnswer: {
         type: String 
        },
      questionType: { 
        type: String, 
        enum: ['MCQ', 'True/False'],
        required: true },
    }],
    duration: { type: Number, required: true }, 
    passThreshold: { type: Number, required: true }, 
  },{timestamps:true});
  
const quiz = mongoose.model('Quiz', quizSchema);
module.exports = {
    quiz
}