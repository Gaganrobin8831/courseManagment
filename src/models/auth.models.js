const mongoose = require('mongoose')

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
    }
},{timestamps:true})

const auth = mongoose.model("student",authSchema)

module.exports = { 
    auth
}