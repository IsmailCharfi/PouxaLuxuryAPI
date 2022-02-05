/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const Order = require("../Models/Order");
const HttpError = require("../Errors/HttpError");

// Get all orders
exports.getOrders = async (req, res, next) => {};

// Get order by id
exports.getOrderById = async (req, res, next) => {};

// Create an order
exports.createOrder = async (req, res, next) => {};

// Update an order
exports.updateOrder = async (req, res, next) => {};

// Delete an order
exports.deleteOrder = async (req, res, next) => {};
