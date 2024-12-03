const mongoose = require('mongoose');
const Quiz = require('../models/quiz.models')

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  video: { type: String, required: false },
  image: { type: String, required: false },
  pdf: { type: String, required: false },
  courseID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
