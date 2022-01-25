/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Category = require("../Models/Category");
const HttpError = require("../Models/HttpError");

// Get all categories
exports.getCategories = async (req, res, next) => {
  let { q, page, perPage } = req.query;
  perPage = perPage || 5;
  page = page || 1;
  const skip = perPage * (page - 1);
  const query = q ? new RegExp(q.trim(), "i") : null;

  let categories = [];
  try {
    if (!q) categories = await Category.find().skip(skip).limit(perPage);
    else
      categories = await Category.aggregate([
        {
          $addFields: {
            _idStr: { $toString: "$_id" },
            orderStr: { $toString: "$order" },
          },
        },
        {
          $match: {
            $or: [
              { _idStr: { $regex: query } },
              { name: { $regex: query } },
              { orderStr: { $regex: query } },
            ],
          },
        },
        { $project: { _idStr: 0, orderStr: 0 } },
        {
          $skip: skip,
        },
        {
          $limit: perPage,
        },
      ]);
  } catch (error) {
    return next(new HttpError(500, "Fetching categories failed"));
  }
  res.json({ q, page, perPage, categories });
};

// Get category by id
exports.getCategoryById = async (req, res, next) => {
  let category;
  try {
    category = await Category.findById(req.params.categoryId);
  } catch (error) {
    return next(new HttpError(500, "Fetching categories failed"));
  }
  res.json(category);
};

// Create a category
exports.createCategory = async (req, res, next) => {
  const { name, image, order, visibility } = req.body;
  const category = new Category({ name, image, order, visibility });

  try {
    await category.save();
  } catch (error) {
    return next(new HttpError(500, "Category's creation failed"));
  }

  res.status(201).json({ category });
};

// Update a category
exports.updateCategory = async (req, res, next) => {};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findById(req.params.categoryId).remove().exec();
  } catch (error) {
    return next(new HttpError(500, "Category's deletion failed"));
  }
  res.status(200).json({ message: "Category Deleted." });
};
