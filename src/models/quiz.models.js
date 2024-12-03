const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: { 
    type: Number, 
    required: true
  }, 
  passThreshold: { 
    type: Number, 
    required: true
  },
  lessonId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Lesson'
  }
}, { timestamps: true });

const Quiz = mongoose.model('quiz', quizSchema);

module.exports = Quiz;
