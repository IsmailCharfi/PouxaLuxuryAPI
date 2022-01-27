/*** Third-Party imports ***/
const router = require("express").Router();

/*** Custom imports ***/
const productsController = require("../Controllers/productsController");

/***   ROUTE: /api/products/*     ***/

router.get("/", productsController.getProducts);
router.get("/characteristics/", productsController.getCharacteristics);
router.get("/recommendations/:productId", productsController.getRecommendedProducts);
router.get("/:productId", productsController.getProductById);
router.post("/", productsController.createProduct);
router.patch("/:productId", productsController.updateProduct);
router.delete("/:productId", productsController.deleteProduct);

module.exports = router;
