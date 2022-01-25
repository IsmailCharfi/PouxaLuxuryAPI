/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Product = require("../Models/Product");
const HttpError = require("../Models/HttpError");

// Get all products
exports.getProducts = async (req, res, next) => {};

// Get product by id
exports.getProductById = async (req, res, next) => {};

// Create a product
exports.createProduct = async (req, res, next) => {};

// Update a product
exports.updateProduct = async (req, res, next) => {};

// Delete a product
exports.deleteProduct = async (req, res, next) => {};
