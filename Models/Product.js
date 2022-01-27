/*** Third-Party imports ***/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = require("./Category");

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  ref: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, trim: true },
  brand: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  mainImage: { type: String, required: true, trim: true },
  images: { type: [String] },
  type: { type: [String], required: true },
  tags: { type: [String] },
  stock: {
    type: [
      {
        color: String,
        sizes: [
          {
            size: Number,
            quantity: Number,
          },
        ],
      },
    ],
    required: true,
  },
});

ProductSchema.pre("save", async function (next) {
  const category = await Category.findById(this.category);
  if (!this.description) {
    this.description = category.name;
  }
  if (!this.tags.length) {
    this.tags.push(category.name);
    this.tags.push(this.brand);
    this.stock.map((el) => this.tags.push(el.color));
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
