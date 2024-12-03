const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { checkAuth } = require('../middleware/auth.middleware');
const { handleCreateLessaon, deleteLesson } = require('../controller/lesson.controller');
const lessonRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

lessonRouter.route('/lessons/:courseId').post(checkAuth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), handleCreateLessaon);

lessonRouter.route('/lessons/:id').delete(checkAuth,deleteLesson)

module.exports = lessonRouter;
