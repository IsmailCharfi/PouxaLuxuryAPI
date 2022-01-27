/*** Third-Party imports ***/

/*** Custom imports ***/
const Category = require("../Models/Category");
const HttpError = require("../Models/HttpError");
const FormError = require("../Models/FormError");
const Validator = require("../Validation/categoryValidation.js");
const Product = require("../Models/Product");

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    let { q, page, limit } = req.query;
    limit = parseInt(limit) || 5;
    page = parseInt(page) || 1;
    const offset = limit * (page - 1);
    const query = q ? new RegExp(q, "i") : new RegExp("");

    const data = await Category.aggregate([
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
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
};

// Get category by id
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new HttpError(404, "Category not found"));
    res.status(200).json({ message: "Success", data: category });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
};

exports.getCategoriesByType = async (req, res, next) => {
  try{
    const products = await Product.find({type: req.params.type})

  } catch (erreur) {}
}

// Create a category
exports.createCategory = async (req, res, next) => {
  try {
    Validator.handleValidationResult(req);
    const category = new Category(req.body);
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successefully", data: category });
  } catch (error) {
    console.log(error);
    if (error instanceof FormError) return next(error);
    return next(new HttpError(500, "Updating failed"));
  }
};

// Update a category
exports.updateCategory = async (req, res, next) => {
  try {
    Validator.handleValidationResult(req);
    const category = await Category.findByIdAndUpdate(
      { _id: req.params.categoryId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!category) return next(new HttpError(404, "Category not found"));
    res
      .status(200)
      .json({ message: "Category upadted successefully", data: category });
  } catch (error) {
    console.log(error);
    if (error instanceof FormError) return next(error);
    return next(new HttpError(500, "Updating failed"));
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.deleteOne({ _id: req.params.categoryId });
    res.status(200).json({ message: "Category Deleted.", data: null });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Category's deletion failed"));
  }
};
