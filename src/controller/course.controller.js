const { auth } = require('../models/auth.models');
const { Course } = require('../models/course.models');
const { Progress } = require('../models/progress.models');
const ResponseUtil = require('../utility/respone.utility'); 


async function createCourse(req, res){
  const { name, description } = req.body;
  // console.log({ name, description })
  const {role} = req.user;

  if(role != "admin"){
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can Create Courses',
      data: null,
      statusCode: 400,
    }, res);
  }
  try {

    if (req.user.role !== 'admin') {
      return new ResponseUtil(
        { success: false, message: 'Only admin can create courses', data: null, statusCode: 400 },
        res
      );
    }

    const courseDetail = await Course.findOne({name})
    
    if (courseDetail) {
      // console.log(courseDetail) 
      return new ResponseUtil(
        { success: false, message: 'Course already exists', data: null, statusCode:400 },res
      )
    }

    const newCourse = new Course({
      name,
      description,
      createdBy: req.user.id,
    });

    await newCourse.save();

    return new ResponseUtil(
      { success: true, message: 'Course created successfully', data: newCourse, statusCode: 201 },
      res
    );
  } catch (error) {
    console.log(error)
    return new ResponseUtil(
      { success: false, message: 'Error creating course', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
};

async function  getAllCourses(req, res)  {
  const {role} = req.user;

  if(role != "admin"){
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can See All Courses Detail',
      data: null,
      statusCode: 400,
    }, res);
  }
  try {
    const courses = await Course.find({}).populate('lessons', 'title content video image pdf quiz') 
    return new ResponseUtil(
      { success: true, message: 'Courses fetched successfully', data: courses, statusCode: 200 },
      res
    );
  } catch (error) {
    return new ResponseUtil(
      { success: false, message: 'Error fetching courses', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
};

 async function getCourseById(req, res)  {
  const { id } = req.params;

  try {
    const course = await Course.findById(id)
    .populate('lessons', 'title content video image pdf quiz') 
     
    if (!course) {
      return new ResponseUtil(
        { success: false, message: 'Course not found', data: null, statusCode: 404 },
        res
      );
    }

    return new ResponseUtil(
      { success: true, message: 'Course fetched successfully', data: course, statusCode: 200 },
      res
    );
  } catch (error) {
    return new ResponseUtil(
      { success: false, message: 'Error fetching course', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
};

async function updateCourse(req, res)  {
  const { id } = req.params;
  const { description } = req.body; 
  const {role} = req.user;

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

   
    await auth.updateMany(
      { Courses: id }, 
      { $pull: { Courses: id } } 
    );

    return new ResponseUtil({
      success: true,
      message: 'Course deleted successfully and removed from students',
      data: deletedCourse,
      statusCode: 200,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error deleting course',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
};

async function getCourseProgress(req, res) {
  const { studentId, courseId } = req.body;
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