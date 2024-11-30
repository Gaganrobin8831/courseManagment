const streamifier = require('streamifier');
const Lesson = require('../models/lesson.models');
const ResponseUtil = require('../utility/respone.utility');
const { Course } = require('../models/course.models');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


async function handleCreateLessaon(req,res) {
  
        const { title, content } = req.body;
        const courseId = req.params.courseId;
      
        if (!title || !content) {
          return new ResponseUtil({
            success: false,
            message: 'Title and content are required.',
            data: null,
            statusCode: 400,
          }, res);
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
      
         
          const lessonData = {
            title,
            content,
            video: result.videoUrl || null,
            image: result.imageUrl || null,
            pdf: result.pdfUrl || null,
          };
      
          const newLesson = new Lesson(lessonData);
          await newLesson.save();
      
          course.lessons.push(newLesson._id);
          await course.save();
      
          return new ResponseUtil({
            success: true,
            message: 'Lesson created successfully',
            data: newLesson,
            statusCode: 201,
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
module.exports = {
    handleCreateLessaon
}