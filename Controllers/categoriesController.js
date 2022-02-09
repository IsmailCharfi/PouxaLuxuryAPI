/*** Third-Party imports ***/
const fs = require("fs");
const path = require("path");

/*** Custom imports ***/
const HttpError = require("../Misc/Errors/HttpError");
const FormError = require("../Misc/Errors/FormError");
const Category = require("../Models/Category");
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
      { $sort: { updatedAt: -1 } },
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
  try {
    let categories = await Product.aggregate([
      { $match: { type: req.params.type } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $set: {
          category: { $first: "$category" },
        },
      },
      { $match: { "category.order": { $ne: 0 } } },
      { $sort: { "category.order": 1 } },
      { $match: { "category.visibility": true } },
      { $group: { _id: "$category" } },
    ]);
    categories = categories.map((el) => el._id);
    res.status(200).json({ message: "Success", data: categories });
  } catch (erreur) {
    console.log(error);
    return next(new HttpError(500, "Fetching categories failed"));
  }
};

// Create a category
exports.createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save(req);
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
    const _id = req.params.categoryId;
    const { name, order, visibility } = req.body;
    const category = await Category.findById(_id);
    if (!category) return next(new HttpError(404, "Category not found"));
    if (category.name !== name) category.name = name;
    if (category.order !== order) category.order = order;
    if (category.visibility !== visibility) category.visibility = visibility;
    await category.save(req);

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
    const category = await Category.findById(req.params.categoryId)
    await category.deleteOne();
    res.status(200).json({ message: "Category Deleted.", data: null });
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Category's deletion failed"));
  }
};
