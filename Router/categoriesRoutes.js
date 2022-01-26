/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require("express-validator");

/*** Custom imports ***/
const categoriesController = require("../Controllers/categoriesController");

/***   ROUTE: /api/categories/*     ***/

router.get("/", categoriesController.getCategories);
router.get("/:categoryId", categoriesController.getCategoryById);
router.post("/", categoriesController.createCategory);
router.patch("/:categoryId", categoriesController.updateCategory);
router.delete("/:categoryId", categoriesController.deleteCategory);

module.exports = router;
