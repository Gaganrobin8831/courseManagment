const express = require('express');
const Lesson = require('../models/lesson.models');
const Course = require('../models/course.models');
const { checkAuth} = require('../middleware/auth.middleware');
const upload = require('../handlefunc/multer.hanldlefunc');  
const router = express.Router();

router.post('/lessons/:courseId', checkAuth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]), async (req, res) => {
  const { title, content } = req.body;
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessonData = {
      title,
      content,
      video: req.files?.video[0]?.path || null,
      image: req.files?.image[0]?.path || null,
      pdf: req.files?.pdf[0]?.path || null,
    };

    const newLesson = new Lesson(lessonData);
    await newLesson.save();
    course.lessons.push(newLesson._id);
    await course.save();

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson', error });
  }
});

module.exports = router;
