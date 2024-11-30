const { auth } = require('../models/auth.models');
const { Course } = require('../models/course.models');
const { Progress } = require('../models/progress.models');
const ResponseUtil = require('../utility/respone.utility');

async function handleAssignCourses(req,res) {
    const { studentId, courseId } = req.body;

  try {
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

    if (!student.Courses.includes(courseId)) {
      student.Courses.push(courseId);
      await student.save();

      return new ResponseUtil({
        success: true,
        message: 'Course assigned successfully',
        data: null,
        statusCode: 200,
      }, res);

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

async function handleGetReportsStudents(req,res) {
    try {
        const students = await auth.find();
        const reports = await Promise.all(students.map(async (student) => {
          const courses = await Course.find({ _id: { $in: student.Courses } });
          const progress = await Progress.find({ studentId: student._id });
    
          return {
            student,
            courses,
            progress,
          };
        }));
    
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
          errors: error,
        }, res);
      }
}

module.exports = {
    handleAssignCourses,
    handleGetReportsStudents
}