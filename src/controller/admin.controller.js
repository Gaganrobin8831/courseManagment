const { auth } = require('../models/auth.models');
const { Course } = require('../models/course.models');
const Lesson = require('../models/lesson.models');
const { Progress } = require('../models/progress.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function handleAssignCourses(req, res) {
  const { studentId, courseId } = req.body;
  const { role } = req.user;
  

  try {
    if (role != "admin") {
      return new ResponseUtil({
        success: false,
        message: 'Only Admin Can Assign',
        data: null,
        statusCode: 400,
      }, res);
    }
    const student = await auth.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return new ResponseUtil({
        success: false,
        message: 'Student or Course not found',
        data: null,
        statusCode: 400,
      }, res);
    }

    if (!course.studentIds.includes(studentId)) {
      course.studentIds.push(studentId);
      await course.save();

      return new ResponseUtil({
        success: true,
        message: 'Course assigned to student successfully',
        data: null,
        statusCode: 200,
      }, res);

    }else{
      return new ResponseUtil({
        success:flase,
        message: 'Course already assigned',
        data: null,
        statusCode: 400,
      },res)
    }


  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error assigning course',
      data: null,
      statusCode: 500,
      errors: error,
    }, res);
  }
}

async function handleGetReportsStudents(req, res) {
  const { role } = req.user;

 
  if (role !== "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can See All Students Detail',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
   
    const reports = await auth.aggregate([
     
      {
        $lookup: {
          from: 'courses',
          localField: '_id', 
          foreignField: 'studentId', 
          as: 'courses', 
        },
      },
      {
        $unwind: {
          path: '$courses',
          preserveNullAndEmptyArrays: true 
        },
      },
    
      {
        $lookup: {
          from: 'lessons',
          localField: 'courses._id', 
          foreignField: 'courseID',
          as: 'courses.lessons', 
        },
      },
      
      {
        $unwind: {
          path: '$courses.lessons',
          preserveNullAndEmptyArrays: true 
        },
      },
    
      {
        $lookup: {
          from: 'quizzes',
          localField: 'courses.lessons._id', 
          foreignField: 'lessonId', 
          as: 'courses.lessons.quizzes', 
        },
      },
     
      {
        $unwind: {
          path: '$courses.lessons.quizzes',
          preserveNullAndEmptyArrays: true 
        },
      },
    
      {
        $lookup: {
          from: 'questions', 
          localField: 'courses.lessons.quizzes._id', 
          foreignField: 'quizId', 
          as: 'courses.lessons.quizzes.questions', 
        },
      },
     
      {
        $lookup: {
          from: 'progresses', 
          localField: '_id', 
          foreignField: 'studentId', 
          as: 'progress',
        },
      },
  
      {
        $project: {
          student: { _id: 1, name: 1, email: 1 }, 
          courses: {
            _id: 1,
            name: 1,
            description: 1,
            lessons: {
              _id: 1,
              title: 1,
              content: 1,
              quiz: {
                _id: 1,
                title: 1,
                questions: {
                  _id: 1,
                  question: 1,
                  options: 1,
                  correctAnswer: 1,
                },
              },
            },
          },
          progress: 1,
        },
      },
    ]);

    return new ResponseUtil({
      success: true,
      message: 'Reports generated successfully',
      data: reports,
      statusCode: 200,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error generating reports',
      data: null,
      statusCode: 500,
      errors: error.message || error,
    }, res);
  }
}


module.exports = {
  handleAssignCourses,
  handleGetReportsStudents,
}