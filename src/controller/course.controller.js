const Course = require('../models/course.models');
const ResponseUtil = require('../utility/respone.utility'); 


exports.createCourse = async (req, res) => {
  const { name, description } = req.body;

  try {

    if (req.user.role !== 'admin') {
      return new ResponseUtil(
        { success: false, message: 'Only admin can create courses', data: null, statusCode: 403 },
        res
      );
    }

    const newCourse = new Course({
      name,
      description,
      createdBy: req.user._id,
    });

    await newCourse.save();

    return new ResponseUtil(
      { success: true, message: 'Course created successfully', data: newCourse, statusCode: 201 },
      res
    );
  } catch (error) {
    return new ResponseUtil(
      { success: false, message: 'Error creating course', data: null, statusCode: 500, errors: error.message },
      res
    );
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}); 
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


exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

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


exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
   
    if (req.user.role !== 'admin') {
      return new ResponseUtil(
        { success: false, message: 'Only admin can update courses', data: null, statusCode: 403 },
        res
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, description },
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


exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

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
