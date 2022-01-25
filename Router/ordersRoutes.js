/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');

/*** Custom imports ***/
const ordersController = require("../Controllers/ordersController");

/***   ROUTE: /api/orders/*     ***/

router.get("/", ordersController.getOrders);
router.get("/:orderId", ordersController.getOrderById);
router.post("/", ordersController.createOrder);
router.patch("/:orderId", ordersController.updateOrder);
router.delete("/:orderId", ordersController.deleteOrder);

module.exports = router;
