const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    video: {
        type: String
    },
    image: {
        type: String
    },
    pdf: {
        type: String
    },
    quizzes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'    
        }
    ],
},{timestamps:true});

const lesson = mongoose.model('Lesson', lessonSchema);

module.exports = {
    lesson
}