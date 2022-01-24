/*** Third-Party imports ***/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, required: true },
  visibility: { type: Boolean, required: true },
});

module.exports = mongoose.model('Category', CategorySchema);
