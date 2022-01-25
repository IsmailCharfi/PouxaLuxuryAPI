/*** Third-Party imports ***/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({});

module.exports = mongoose.model("Product", ProductSchema);
