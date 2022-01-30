/*** Third-Party imports ***/
const { body, validationResult } = require("express-validator");

/*** Custom imports ***/
const FormError = require("../Models/FormError");

const IMAGE_MIME_TYPE = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

exports.formValidation = [
  body("name").trim().notEmpty().withMessage("veuillez entrer un nom non vide"),
  body("visibility").isBoolean().withMessage("veuillez choisir la visibilité"),
  body("image")
    .custom((value, { req }) => {
      if (req.body.mode && req.body.mode === "EDIT" && !req.file && !req.files) return true
      else {
        if (req.files) return IMAGE_MIME_TYPE.includes(req.files.mimetype);
        if (req.file) return IMAGE_MIME_TYPE.includes(req.file.mimetype);
        }
    })
    .withMessage("veuillez choisir une image valide"),
];

exports.handleValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = [];
    result.errors.forEach((error) =>
      errors.push({
        rejectedInput: error.param,
        rejectedValue: error.value,
        errorMessage: error.msg,
      })
    );
    throw new FormError(errors);
  }
  next();
};
