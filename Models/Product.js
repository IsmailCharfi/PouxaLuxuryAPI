/*** Third-Party imports ***/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  ref: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required:true },
  description: { type: String, trim: true },
  brand: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  mainImage: { type: String, required: true, trim: true },
  images: { type: [String] },
  type: { type: [String], required: true },
  tags: { type: [String] },
  stock: [Object],
  visibility: { type: Boolean },
});

ProductSchema.pre("save", function (next) {
  if (!this.description) {
    this.description = this.category;
  }
  if (!this.tags.length) {
    this.tags.push(this.category);
    this.tags.push(this.brand);
    this.stock.map((el) => this.tags.push(el.color));
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
