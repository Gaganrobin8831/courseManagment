const { auth } = require('../models/auth.models');
const { Course } = require('../models/course.models');
const Lesson = require('../models/lesson.models');
const { Progress } = require('../models/progress.models');
const Quiz = require('../models/quiz.models');
const ResponseUtil = require('../utility/respone.utility');

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

async function handleGetReportsStudents(req, res) {
  const { role } = req.user;

  if (role != "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can See All Students Detail',
      data: null,
      statusCode: 400,
    }, res);
  }
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

async function handleAssignQuizToLesson(req, res) {
  const { lessonId, quizId } = req.body;
  // const { role } = req.user;
  try {
    const lesson = await Lesson.findById({ _id: lessonId });
    // console.log(lesson)
    if (!lesson) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson not found',
        data: null,
        statusCode: 400
      }, res)
    }
    const quiz = await Quiz.findOne({ _id: quizId })
    // console.log(quiz)
    if (!quiz) {
      return new ResponseUtil({
        success: false,
        message: 'Quiz not found',
        data: null,
        statusCode: 400
      }, res)
    }
    if (!lesson.quiz.includes(quizId)) {
      lesson.quiz.push(quizId);
      await lesson.save();

      return new ResponseUtil({
        success: true,
        message: 'Quiz assigned successfully',
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

async function handleAssignLessonToCourses(req, res) {
  const { lessonId, courseId } = req.body;
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

    const course = await Course.findById(courseId).lean();
    const lesson = await Lesson.findById(lessonId).lean();

    // console.log({ lesson, course })
    if (!lesson || !course) {
      return new ResponseUtil({
        success: false,
        message: 'Student or Course not found',
        data: null,
        statusCode: 400,
      }, res);
    }
    console.log(course.lessons.includes(lessonId))
    if (!course.lessons.includes(lessonId)) {
      course.lessons.push(lessonId);
      await Course.findByIdAndUpdate(courseId, { lessons: course.lessons });

      console.log("lessonId, course");

      return new ResponseUtil({
        success: true,
        message: 'Lesson Assigned To Course successfully',
        data: null,
        statusCode: 200,
      }, res);

    }


  } catch (error) {
    console.log(error)
    return new ResponseUtil({
      success: false,
      message: 'Error assigning lesson',
      data: null,
      statusCode: 500,
      errors: error,
    }, res);
  }
}


module.exports = {
  handleAssignCourses,
  handleGetReportsStudents,
  handleAssignQuizToLesson,
  handleAssignLessonToCourses
}