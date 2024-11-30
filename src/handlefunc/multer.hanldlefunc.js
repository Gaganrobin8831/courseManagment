const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.config');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course-management',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'mp4'],
  },
});

const upload = multer({ storage });
// console.log({upload})
module.exports = upload;
