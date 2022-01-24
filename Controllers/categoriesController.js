/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Category = require("../Models/Category");
const HttpError = require("../Models/HttpError");

// Get all categories
exports.getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (error) {
    return next(new HttpError(500, "Fetching categories failed"));
  }
  res.json({ categories });
};

// Get category by id
exports.getCategoryById = async (req, res, next) => {
  let category;
  try {
    category = await Category.findById(req.params.catid);
  } catch (error) {
    return next(new HttpError(500, "Fetching categories failed"));
  }
  res.json(category);
};

exports.createCategory = async (req, res, next) => {
  const { name, image, order, visibility } = req.body;
  const category = new Category({ name, image, order, visibility });

  try {
    await category.save();
  } catch (error) {
    return next(new HttpError(500, "Creating a category failed"));
  }

  res.status(201).json({ category });
};

exports.updateCategory = async (req, res, next) => {};

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findById(req.params.catid).remove().exec();
  } catch (error) {
    return next(new HttpError(500, "Deleting the category failed"));
  }
  res.status(200).json({ message: "Deleted Category." });
};

