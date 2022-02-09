const HttpError = require("../Misc/Errors/HttpError");

module.exports = (req, res, next) => {
  throw new HttpError(404, "Page not found");
};
