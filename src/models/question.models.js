
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz'
    },
    questions: {
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
}, { timestamps: true });

const question = mongoose.model('question', questionSchema);

module.exports = question;
