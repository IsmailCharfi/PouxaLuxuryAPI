/*** Third-Party imports ***/
const { body, validationResult } = require("express-validator");

/*** Custom imports ***/
const FormError = require("../Models/FormError");

exports.formValidation = [
  body("name").trim().notEmpty().withMessage("veuillez entrer un nom non vide"),
  body("image")
    .notEmpty()
    .trim()
    .withMessage("veuillez sélectionner une image valide"),
  body("visibility").isBoolean().withMessage("veuillez choisir la visibilité"),
];

exports.handleValidationResult = (req) => {
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
    throw new FormError(422, "les informations fournies ne sont pas valides", errors);
  }
};
