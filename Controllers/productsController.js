/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Product = require("../Models/Product");
const HttpError = require("../Models/HttpError");

// Get all products
exports.getProducts = async (req, res, next) => {};

// Get product by id
exports.getProductById = async (req, res, next) => {
  let product;
  try {
    product = await Product.findById(req.params.productId);
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
exports.updateProduct = async (req, res, next) => {};

// Delete a product
exports.deleteProduct = async (req, res, next) => {};
