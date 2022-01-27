/*** Third-Party imports ***/
const router = require("express").Router();

/*** Custom imports ***/
const categoriesController = require("../Controllers/categoriesController");
const Validator = require("../Validation/categoryValidation");

/***   ROUTE: /api/categories/*     ***/

router.get("/", categoriesController.getCategories);
router.get("/type/:type", categoriesController.getCategoriesByType)
router.get("/:categoryId", categoriesController.getCategoryById);
router.post("/", Validator.formValidation, categoriesController.createCategory);
router.patch("/:categoryId", Validator.formValidation, categoriesController.updateCategory);
router.delete("/:categoryId", categoriesController.deleteCategory);

module.exports = router;
