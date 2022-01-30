/*** Third-Party imports ***/
const router = require("express").Router();

/*** Custom imports ***/
const categoriesController = require("../Controllers/categoriesController");
const Validator = require("../Validation/categoryValidation");
const imageUploader = require("../Middlewares/imageUploader");

/***   ROUTE: /api/categories/*     ***/

router.get("/", categoriesController.getCategories);
router.get("/type/:type", categoriesController.getCategoriesByType);
router.get("/:categoryId", categoriesController.getCategoryById);
router.post(
  "/",
  imageUploader.single("image"),
  Validator.formValidation,
  Validator.handleValidationResult,
  categoriesController.createCategory
);
router.patch(
  "/:categoryId",
  imageUploader.single("image"),
  Validator.formValidation,
  Validator.handleValidationResult,
  categoriesController.updateCategory
);
router.delete("/:categoryId", categoriesController.deleteCategory);

module.exports = router;
