const mongoose = require('mongoose')
const { Course } = require('../models/course.models'); 

const authSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:null
    },
    role: {
        type: String,
        enum: ['student','admin'],
        default: 'student'
    },
    Courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
},{timestamps:true})

const auth = mongoose.model("student",authSchema)

module.exports = { 
    auth
}