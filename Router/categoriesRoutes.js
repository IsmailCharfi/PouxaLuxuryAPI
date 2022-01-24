/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');


/*** Custom imports ***/
const categoriesController = require("../Controllers/categoriesController");

/***   ROUTE: /api/categories/*     ***/

router.get("/", categoriesController.getCategories);
router.get("/:catid", categoriesController.getCategoryById);
router.post("/", categoriesController.createCategory);
router.patch("/:catid", categoriesController.updateCategory);
router.delete("/:catid", categoriesController.deleteCategory);

module.exports = router;
