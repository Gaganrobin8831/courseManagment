const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { checkAuth } = require('../middleware/auth.middleware');
const { handleCreateLessaon } = require('../controller/lesson.controller');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const lessonRouter = express.Router();

lessonRouter.post('/lessons/:courseId', checkAuth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), handleCreateLessaon);


module.exports = lessonRouter;
