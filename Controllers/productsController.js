/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Product = require("../Models/Product");
const HttpError = require("../Models/HttpError");

// Get all products
exports.getProducts = async (req, res, next) => {
  let { q, page, limit } = req.query;
  limit = parseInt(limit) || 5;
  page = parseInt(page) || 1;
  const offset = limit * (page - 1);
  const query = q ? new RegExp(q, "i") : new RegExp("");

  let data;
  try {
    data = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "cat",
        },
      },
      /* {
        $addFields: {
          priceStr: { $toString: "$price" },
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
      }, */
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

// Get product by id
exports.getProductById = async (req, res, next) => {
  let product;
  try {
    product = await Product.findById(req.params.productId);
    if (!product) return next(new HttpError(404, "Product not found"));
  } catch (error) {
    return next(new HttpError(500, "Fetching products failed"));
  }
  res.status(200).json({ message: "Success", data: product });
};

// Create a product
exports.createProduct = async (req, res, next) => {
  const product = new Product(req.body);

  try {
    await product.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "product's creation failed"));
  }

  res
    .status(201)
    .json({ message: "product Created successefully", data: product });
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  let product;
  try {
    product = await Product.findByIdAndUpdate(
      { _id: req.params.productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) return next(new HttpError(404, "Product not found"));
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Updating failed"));
  }
  res
    .status(200)
    .json({ message: "Product upadted successefully", data: product });
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.deleteOne({ _id: req.params.productId });
    if (!deleted.deletedCount)
      return next(new HttpError(404, "Product not found"));
  } catch (error) {
    console.log(error);
    return next(new HttpError(500, "Product's deletion failed"));
  }
  res.status(200).json({ message: "Product Deleted.", data: null });
};
