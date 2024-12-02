const { Course } = require('../models/course.models');
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
    
    if (req.user.role !== 'admin') {
      return new ResponseUtil(
        { success: false, message: 'Only admin can update courses', data: null, statusCode: 403 },
        res
      );
    }
    if(req.user.name){
      return new ResponseUtil(
        {
          success: false,
          message: 'No You Can not Update name',
          data: null,
          statusCode: 403
        },res
      )
    }
   
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


 async function deleteCourse(req, res)  {
  const { id } = req.params;
  const {role} = req.user;

  if(role != "admin"){
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can See delete Courses',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
   
    if (req.user.role !== 'admin') {
      return new ResponseUtil(
        { success: false, message: 'Only admin can delete courses', data: null, statusCode: 403 },
        res
      );
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return new ResponseUtil(
        { success: false, message: 'Course not found', data: null, statusCode: 404 },
        res
      );
    }

    return new ResponseUtil(
      { success: true, message: 'Course deleted successfully', data: deletedCourse, statusCode: 200 },
      res
    );
  } catch (error) {
    return new ResponseUtil(
      { success: false, message: 'Error deleting course', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
}