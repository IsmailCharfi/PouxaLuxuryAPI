/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');

/*** Custom imports ***/
const productsController = require("../Controllers/productsController");

/***   ROUTE: /api/products/*     ***/

router.get("/", productsController.getProducts);
router.get("/recommendations", productsController.getRecommendedProducts)
router.get("/characteristics", productsController.getCharacteristics)
router.get("/:productId", productsController.getProductById);
router.post("/", productsController.createProduct);
router.patch("/:productId", productsController.updateProduct);
router.delete("/:productId", productsController.deleteProduct);

module.exports = router;
