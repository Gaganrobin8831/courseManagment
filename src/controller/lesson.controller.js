const streamifier = require('streamifier');
const Lesson = require('../models/lesson.models');
const ResponseUtil = require('../utility/respone.utility');
const { Course } = require('../models/course.models');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const mongoose = require('mongoose');


function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function handleCreateLessaon(req, res) {

  const { title, content } = req.body;
  const courseId = req.params.courseId;
  const { role } = req.user;

  if (role != "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can Create Lessons',
      data: null,
      statusCode: 400,
    }, res);
  }

  if (!title || !content) {
    return new ResponseUtil({
      success: false,
      message: 'Title and content are required.',
      data: null,
      statusCode: 400,
    }, res);
  }
  if (!isValidObjectId(courseId)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid courseId.',
      data: null,
      statusCode: 400,
    }, res)
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return new ResponseUtil({
        success: false,
        message: 'Course not found',
        data: null,
        statusCode: 404,
      }, res);
    }

    const lessonDetail = await Lesson.findOne({ title });
    if (lessonDetail) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson already exists',
        data: null,
        statusCode: 400,
      }, res);
    }


    const result = {};
    const filePaths = {
      image: req.files?.image ? req.files.image[0].buffer : null,
      video: req.files?.video ? req.files.video[0].buffer : null,
      pdf: req.files?.pdf ? req.files.pdf[0].buffer : null,
    };


    if (filePaths.image) {
      result.imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'course-management/images',
            resource_type: 'image',
          },
          (error, image) => {
            if (error) return reject(error);
            resolve(image.secure_url);
          }
        );
        streamifier.createReadStream(filePaths.image).pipe(uploadStream);
      });
    }


    if (filePaths.video) {
      result.videoUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'course-management/videos',
            resource_type: 'video',
          },
          (error, video) => {
            if (error) return reject(error);
            resolve(video.secure_url);
          }
        );
        streamifier.createReadStream(filePaths.video).pipe(uploadStream);
      });
    }


    if (filePaths.pdf) {
      result.pdfUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'course-management/pdfs',
            resource_type: 'raw',
          },
          (error, pdf) => {
            if (error) return reject(error);
            resolve(pdf.secure_url);
          }
        );
        streamifier.createReadStream(filePaths.pdf).pipe(uploadStream);
      });
    }

    console.log(result.videoUrl, result.imageUrl, result.pdfUrl)
    const lessonData = {
      title,
      content,
      video: result.videoUrl || null,
      image: result.imageUrl || null,
      pdf: result.pdfUrl || null,
      courseID: courseId
    };

    const newLesson = new Lesson(lessonData);
    await newLesson.save();

    course.lessons.push(newLesson._id);
    await course.save();

    return new ResponseUtil({
      success: true,
      message: 'Lesson created successfully',
      data: newLesson,
      statusCode: 200,
    }, res);

  } catch (error) {
    console.error(error);
    return new ResponseUtil({
      success: false,
      message: 'Error creating lesson',
      data: null,
      statusCode: 500,
      errors: error.message || JSON.stringify(error),
    }, res);
  }
}


async function deleteLesson(req, res) {
  const { id } = req.params;
  const { role } = req.user;


  if (!isValidObjectId(id)) {
    return new ResponseUtil({
      success: false,
      message: 'Please Enter Valid lessonId.',
      data: null,
      statusCode: 400,
    }, res);
  }

  
  if (role !== "admin") {
    return new ResponseUtil({
      success: false,
      message: 'Only Admin Can Delete Lessons',
      data: null,
      statusCode: 400,
    }, res);
  }

  try {
  
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson) {
      return new ResponseUtil({
        success: false,
        message: 'Lesson not found',
        data: null,
        statusCode: 404,
      }, res);
    }

   
    const quizzesToDelete = await Quiz.find({ lessonId: id });

    if (quizzesToDelete.length === 0) {
      return new ResponseUtil({
        success: false,
        message: 'No quizzes found for this lesson',
        data: null,
        statusCode: 404,
      }, res);
    }

   
    const quizIds = quizzesToDelete.map(quiz => quiz._id);

    
    await Question.deleteMany({
      quizId: { $in: quizIds }
    });

   
    await Quiz.deleteMany({
      lessonId: id
    });

    return new ResponseUtil({
      success: true,
      message: 'Lesson and all related quizzes and questions deleted successfully',
      data: deletedLesson,
      statusCode: 200,
    }, res);

  } catch (error) {
    return new ResponseUtil({
      success: false,
      message: 'Error deleting lesson and related data',
      data: null,
      statusCode: 500,
      errors: error.message,
    }, res);
  }
}

module.exports = {
  handleCreateLessaon,
  deleteLesson
}