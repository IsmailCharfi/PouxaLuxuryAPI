/*** Third-Party imports ***/
const router = require("express").Router();

/*** Custom imports ***/
const authRoutes = require("./authRoutes");
const categoriesRoutes = require("./categoriesRoutes");
const productsRoutes = require("./productsRoutes");
const ordersRoutes = require("./ordersRoutes");
const statsRoutes = require("./statsRoutes");
const usersRoutes = require("./usersRoutes");

/***   ROUTE: /api/*     ***/

router.use("/auth", authRoutes);
router.use("/categories/", categoriesRoutes);
router.use("/products/", productsRoutes);
router.use("/orders/", ordersRoutes);
router.use("/stats", statsRoutes);
router.use("/users/", usersRoutes);

module.exports = router;
