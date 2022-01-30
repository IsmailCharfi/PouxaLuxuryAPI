/*** Third-Party imports ***/
const multer = require("multer");
const { v4: uuid } = require("uuid");
const { join } = require("path");

const IMAGE_MIME_TYPE = ["image/jpg", "image/jpeg", "image/png", "image/gif"];


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(appRoot, "Uploads", "Images"));
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + "-" + file.originalname);
  },
  fileFilter: (req, file, cb) => {
    const isValid = IMAGE_MIME_TYPE.includes(file.mimetype);
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

const imageUploader = multer({ storage });

module.exports = imageUploader;
