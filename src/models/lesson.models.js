const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  video: { type: String, required: false },
  image: { type: String, required: false },
  pdf: { type: String, required: false },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', default: null },  
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
