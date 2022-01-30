/*** Third-Party imports ***/
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    visibility: { type: Boolean, required: true },
    image: { type: String },
    order: { type: Number },
  },
  {
    timestamps: true,
  }
);

CategorySchema.pre("save", async function (next, req) {
  if (!this.order) this.order = 0;
  if (this.visibility === undefined) this.visibility = true;
  this.image = `http://localhost:5000/uploads/images/${path.parse(req.file.path).base}`;

  next();
});

module.exports = mongoose.model("Category", CategorySchema);
