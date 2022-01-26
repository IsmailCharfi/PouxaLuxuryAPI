/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Category = require("../Models/Category");
const HttpError = require("../Models/HttpError");

// Get all categories
exports.getCategories = async (req, res, next) => {
  let { q, page, limit } = req.query;
  limit = parseInt(limit) || 5;
  page = parseInt(page) || 1;
  const offset = limit * (page - 1);
  const query = q ? new RegExp(q, "i") : new RegExp("");

  let data;
  try {
    data = await Category.aggregate([
      {
        $addFields: {
          orderStr: { $toString: "$order" },
        },
      },
      {
        $match: {
          $or: [{ name: { $regex: query } }, { orderStr: { $regex: query } }],
        },
      },
      { $project: { orderStr: 0 } },
      {
        $group: {
          _id: null,
          docs: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          docs: { $slice: ["$docs", offset, limit] },
        },
      },
    ]);
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
  res.status(200).json({
    message: "Success",
    data: {
      totalCount: data.length ? data[0].count : 0,
      q,
      page,
      limit,
      categories: data.length ? data[0].docs : [],
    },
  });
};

// Get category by id
exports.getCategoryById = async (req, res, next) => {
  let category;
  try {
    category = await Category.findById(req.params.categoryId);
    if (!category) return next(new HttpError(404, "Category not found"));
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
  res.status(200).json({ message: "Success", data: category });
};

// Create a category
exports.createCategory = async (req, res, next) => {
  const category = new Category(req.body);
  try {
    await category.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Category's creation failed"));
  }
  res
    .status(201)
    .json({ message: "Category created successefully", data: category });
};

// Update a category
exports.updateCategory = async (req, res, next) => {
  let category;
  try {
    category = await Category.findByIdAndUpdate(
      { _id: req.params.categoryId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!category) return next(new HttpError(404, "Category not found"));
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Updating failed"));
  }
  res
    .status(200)
    .json({ message: "Category upadted successefully", data: category });
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.deleteOne({ _id: req.params.categoryId });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Category's deletion failed"));
  }
  res.status(200).json({ message: "Category Deleted.", data: null });
};
