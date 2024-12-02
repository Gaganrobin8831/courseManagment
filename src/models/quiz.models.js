const mongoose = require('mongoose');

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
          type: String,
          required: true
        }
      ],
      correctAnswer: {
        type: String, 
        required: true
      },
      questionType: { 
        type: String, 
        enum: ['MCQ', 'True/False'],
        required: true
      },
    }
  ],
  duration: { 
    type: Number, 
    required: true
  }, 
  passThreshold: { 
    type: Number, 
    required: true
  }, 
}, { timestamps: true });

const Quiz = mongoose.model('quiz', quizSchema);

module.exports = Quiz;
