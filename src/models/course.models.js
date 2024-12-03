const mongoose = require('mongoose');
const Lesson = require("../models/lesson.models")
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
    }
},{timestamps:true});

const Course = mongoose.model('Course', courseSchema);

module.exports = {
    Course
}
