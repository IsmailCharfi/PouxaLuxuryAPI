/*** Third-Party imports ***/
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const FormMode = require("../Misc/FormMode")

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

const unlinkImage = (imagePath) => {
  const fileName = path.parse(imagePath).base;
  fs.unlink(`${appRoot}/Uploads/images/categories/${fileName}`, (error) => {
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
  });
};

CategorySchema.pre("save", async function (next, req) {
  if (!this.order) this.order = 0;
  if (this.visibility === undefined) this.visibility = true;
  if (req.file && req.body.mode === FormMode.EDIT_MODE) unlinkImage(this.image);
  if (req.file)
    this.image = `http://localhost:5000/uploads/images/categories/${
      path.parse(req.file.path).base
    }`;

  next();
});

CategorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    if (this.image.length) unlinkImage(this.image);
  }
);

module.exports = mongoose.model("Category", CategorySchema);
