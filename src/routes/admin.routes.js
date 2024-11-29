const { auth } = require('../models/auth.models');
const { Course } = require('../models/course.models');
const ResponseUtil = require('../utility/respone.utility');

router.post('/assign-course', authenticate, authorizeAdmin, async (req, res) => {
  const { studentId, courseId } = req.body;
  
  try {
    const student = await auth.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student) {
        return new ResponseUtil({
            success: false,
            message: 'Student Not Found',
            data: null,
            statusCode: 401,
        }, res);
    }
    if (!course) 
    {
        return new ResponseUtil({
            success: false,
            message: 'Course Not Found',
            data: null,
            statusCode: 401,
        }, res);
    }

    student.courses.push(course._id);
    await student.save();


    return new ResponseUtil({
        success: false,
        message: 'Course assigned to student successfully',
        data: null,
        statusCode: 200,
    }, res);
  } catch (error) {

    return new ResponseUtil({
        success: false,
        message: 'Error assigning course',
        data: null,
        statusCode: 500,
        errors:error
    }, res);
  }
});


router.get('/admin/reports', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const students = await auth.find();
    const reports = await Promise.all(students.map(async (student) => {
      const courses = await Course.find({ students: student._id });
      return {
        student,
        courses,
      };
    }));
   

    return new ResponseUtil({
      success: false,
      message: 'Success',
      data: reports,
      statusCode: 200,
  }, res);
  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error generating report',
      data: null,
      statusCode: 500,
      errors:error
  }, res);
  }
});

