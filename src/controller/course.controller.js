const { default: mongoose } = require('mongoose');
const { auth } = require('../models/auth.models');
const { Course } = require('../models/course.models');
const { Progress } = require('../models/progress.models');
const ResponseUtil = require('../utility/respone.utility'); 
const Lesson = require('../models/lesson.models');

function isValidObjectId(id) {
  return  mongoose.Types.ObjectId.isValid(id);
}

async function createCourse(req, res) {
  const { name, description, studentIds } = req.body;
  const { role } = req.user;

  if (!isValidObjectId(studentIds)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid studentIds.',
      data: null,
      statusCode: 400,
    }, res);
  }

  if (role !== "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can Create Courses',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
    const normalizedCourseName = name.toLowerCase();
    const courseDetail = await Course.findOne({ name: normalizedCourseName }).collation({ locale: 'en', strength: 1 });

    if (courseDetail) {
      return new ResponseUtil({
        success: false,
        message: 'Course already exists',
        data: null,
        statusCode: 400,
      }, res);
    }

    const studentDetails = await auth.find({ _id: { $in: studentIds } });
    if (studentDetails.length !== studentIds.length) {
      return new ResponseUtil({
        success: false,
        message: 'Some students do not exist',
        data: null,
        statusCode: 400,
      }, res);
    }

    const newCourse = new Course({
      name,
      description,
      createdBy: req.user.id,
      studentIds: studentIds
    });

    await newCourse.save();
    return new ResponseUtil({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
      statusCode: 201,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error creating course',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}


async function getAllCourses(req, res) {
  const { role } = req.user;

  if (role !== "admin") {
      return new ResponseUtil({
          success: false,
          message: 'Only Admin Can See All Courses Detail',
          data: null,
          statusCode: 400,
      }, res);
  }

  try {
    
      const courses = await Course.aggregate([
          {
              $lookup: {
                  from: 'lessons',         
                  localField: '_id',       
                  foreignField: 'courseID',  
                  as: 'lessons'             
              }
          },
          {
              $unwind: { path: '$lessons', preserveNullAndEmptyArrays: true } 
          },
          {
              $lookup: {
                  from: 'quizzes',          
                  localField: 'lessons._id',  
                  foreignField: 'lessonId',  
                  as: 'lessons.quizzes'     
              }
          },
          {
              $unwind: { path: '$lessons.quizzes', preserveNullAndEmptyArrays: true } 
          },
          {
              $lookup: {
                  from: 'questions',       
                  localField: 'lessons.quizzes._id',
                  foreignField: 'quizId',    
                  as: 'lessons.quizzes.questions' 
              }
          },
          {
              $project: {
                  name: 1,
                  description: 1,
                  createdBy: 1,
                  studentId: 1,
                  lessons: {
                      title: 1,
                      content: 1,
                      video: 1,
                      image: 1,
                      pdf: 1,
                      quizzes: {
                          title: 1,
                          duration: 1,
                          passThreshold: 1,
                          questions: {
                              question: 1,
                              options: 1,
                              correctAnswer: 1,
                              questionType: 1
                          }
                      }
                  }
              }
          }
      ]);

      return new ResponseUtil(
          { success: true, message: 'Courses with lessons, quizzes, and questions fetched successfully', data: courses, statusCode: 200 },
          res
      );
  } catch (error) {
      return new ResponseUtil(
          { success: false, message: 'Error fetching courses with lessons, quizzes, and questions', data: null, statusCode: 500, errors: error.message },
          res
      );
  }
}

async function getCourseById(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid courseId.',
      data: null,
      statusCode: 400,
    }, res)
  }

  try {
   
    const course = await Course.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) } 
      },
      {
        $lookup: {
          from: 'lessons',          
          localField: '_id',        
          foreignField: 'courseID', 
          as: 'lessons'              
        }
      },
      {
        $unwind: { path: '$lessons', preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'lessons._id', 
          foreignField: 'lessonId', 
          as: 'lessons.quizzes' 
        }
      },
      {
        $unwind: { path: '$lessons.quizzes', preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: 'questions',      
          localField: 'lessons.quizzes._id', 
          foreignField: 'quizId',    
          as: 'lessons.quizzes.questions' 
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          createdBy: 1,
          studentId: 1,
          lessons: {
            title: 1,
            content: 1,
            video: 1,
            image: 1,
            pdf: 1,
            quizzes: {
              title: 1,
              duration: 1,
              passThreshold: 1,
              questions: {
                question: 1,
                options: 1,
                correctAnswer: 1,
                questionType: 1
              }
            }
          }
        }
      }
    ]);

    if (!course || course.length === 0) {
      return new ResponseUtil(
        { success: false, message: 'Course not found', data: null, statusCode: 404 },
        res
      );
    }

    return new ResponseUtil(
      { success: true, message: 'Course fetched successfully', data: course[0], statusCode: 200 },
      res
    );
  } catch (error) {
    return new ResponseUtil(
      { success: false, message: 'Error fetching course', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
}

async function updateCourse(req, res)  {
  const { id } = req.params;
  const { description } = req.body; 
  const {role} = req.user;

  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid courseId.',
      data: null,
      statusCode: 400,
    }, res)
  }

  if(role != "admin"){
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can See Update Courses',
      data: null,
      statusCode: 400,
    }, res);
  }
  try {
    

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { description }, 
      { new: true, runValidators: true }
    );

    
    if (!updatedCourse) {
      return new ResponseUtil(
        { success: false, message: 'Course not found', data: null, statusCode: 404 },
        res
      );
    }

    return new ResponseUtil(
      { success: true, message: 'Course updated successfully', data: updatedCourse, statusCode: 200 },
      res
    );
  } catch (error) {
    return new ResponseUtil(
      { success: false, message: 'Error updating course', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
};

async function deleteCourse(req, res) {
  const { id } = req.params;
  const { role } = req.user;

 
  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid courseId.',
      data: null,
      statusCode: 400,
    }, res);
  }

 
  if (role !== "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can Delete Courses',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
    
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return new ResponseUtil({
        success: false,
        message: 'Course not found',
        data: null,
        statusCode: 404,
      }, res);
    }

  
    const lessonsToDelete = await Lesson.find({ courseID: id });

    
    const lessonIds = lessonsToDelete.map(lesson => lesson._id);

    
    const deletedQuizzes = await Quiz.deleteMany({
      lessonId: { $in: lessonIds }
    });

  
    await Question.deleteMany({
      quizId: { $in: deletedQuizzes.map(quiz => quiz._id) } 
    });

    await Lesson.deleteMany({ courseID: id });

    return new ResponseUtil({
      success: true,
      message: 'Course and all related lessons, quizzes, and questions deleted successfully',
      data: deletedCourse,
      statusCode: 200,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error deleting course and related data',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}

async function getCourseProgress(req, res) {
  const { studentId, courseId } = req.body;

  if (!isValidObjectId(courseId) || !isValidObjectId(studentId)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid courseId or studentId.',
      data: null,
      statusCode: 400,
    }, res)
  }
  try {
    const course = await Course.findById(courseId).populate('lessons');
    
    if (!course) {
      return new ResponseUtil({
        success: false,
        message: 'Course not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    const totalLessons = course.lessons.length;

    if (totalLessons === 0) {
      return new ResponseUtil({
        success: true,
        message: 'No lessons in this course',
        data: {
          status: 'no_lessons',
          completionPercentage: 0
        },
        statusCode: 200,
      }, res);
    }

    const progress = await Progress.find({
      studentId,
      lessonId: { $in: course.lessons }
    }).populate('lessonId');

    const completedLessons = progress.filter(p => p.status === 'completed').length;
    console.log(totalLessons);
    
    const completionPercentage = totalLessons > 0 
      ? (completedLessons / totalLessons) * 100 
      : 0;

    let courseStatus = 'not_started';
    if (completedLessons === totalLessons) {
      courseStatus = 'completed';
    } else if (completedLessons > 0) {
      courseStatus = 'in_progress';
    }

    return new ResponseUtil({
      success: true,
      message: 'Course progress details fetched successfully',
      data: {
        status: courseStatus,
        completionPercentage: Math.round(completionPercentage)
      },
      statusCode: 200,
    }, res);
  } catch (error) {
    console.error('Error calculating course progress:', error);
    return new ResponseUtil({
      success: false,
      message: 'Error calculating course progress',
      data: null,
      statusCode: 500,
      errors: error,
    }, res);
  }
}


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseProgress
}