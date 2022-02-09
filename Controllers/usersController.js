/*** Third-Party imports ***/
const { validationResult } = require("express-validator");

/*** Custom imports ***/
const User = require("../Models/User");
const HttpError = require("../Misc/Errors/HttpError");

// Get all users
exports.getUsers = async (req, res, next) => {};

// Get user by id
exports.getUserById = async (req, res, next) => {};

// Create a user
exports.createUser = async (req, res, next) => {};

// Update a user
exports.updateUser = async (req, res, next) => {};

// Delete a user
exports.deleteUser = async (req, res, next) => {};
