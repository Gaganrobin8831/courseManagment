const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    },
    lessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{timestamps:true});

const Course = mongoose.model('Course', courseSchema);

module.exports = {
    Course
}
