/*** Third-Party imports ***/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  order: { type: Number },
  visibility: { type: Boolean, required: true },
});

module.exports = mongoose.model('Category', CategorySchema);
