const HttpError = require("../Models/httpError");
const FormError = require("../Models/FormError");

module.exports = (error, req, res, next) => {
  res.status(error.code || 500);
  const feedBack = {
    status: error.code || 500,
    message: error.message || "An unknown error occurred!",
  };
  if (error instanceof FormError) feedBack.errors = error.rejectedInputs;
  res.json(feedBack);
};
