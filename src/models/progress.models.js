const mongoose = require('mongoose')


const progressSchema = new mongoose.Schema(
    {
    studentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'students' 
        },
    lessonId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'lessons' 
        },
    quizId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'qizzes' 
        },
    status: { 
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started' },
    score: {
         type: Number 
        },
  },{timestamps:true});
  
const Progress = mongoose.model('Progress', progressSchema);
module.exports = {
    Progress
}