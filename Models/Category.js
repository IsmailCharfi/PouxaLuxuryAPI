/*** Third-Party imports ***/
const mongoose = require("mongoose");

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

CategorySchema.pre("save", async function (next) {
  if (!this.order) this.order = 0;
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
