/*** Third-Party imports ***/
const fs = require("fs");

/*** Custom imports ***/
const FormError = require("../Models/FormError");

module.exports = (error, req, res, next) => {

  if (req.file) {
    fs.unlink(req.file.path, error => {
      if (error) console.log("err");
    });
  }

  if (req.files) {
    res.files.forEach(file => {
      fs.unlink(file.path, error => {
        if (error) console.log("err");
      });
    });
  }

  const feedBack = {
    status: Number.isInteger(error.code) ? error.code : 500,
    message: error.message || "An unknown error occurred!",
  };
  if (error instanceof FormError) feedBack.errors = error.rejectedInputs;
  
  res.status(feedBack.status).json(feedBack);
};
