const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where uploaded images will be stored
    cb(null, 'uploads/'); // You can change 'uploads/' to your desired folder
  },
  filename: function (req, file, cb) {
    // Specify how the uploaded image file should be named
    cb(null, Date.now() + '-' + file.originalname); // You can modify the filename as needed
  }
});

// Multer file filter to accept only image files
const fileFilter = (req, file, cb) => {
  // Check if the uploaded file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Uploaded file is not an image'), false); // Reject the file
  }
};

// Multer function to handle file uploads
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;