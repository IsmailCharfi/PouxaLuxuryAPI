/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');

/*** Custom imports ***/
const statsController = require("../Controllers/statsController");

/***   ROUTE: /api/stats/*     ***/

router.get("/", statsController.getStats);
router.get("/visitors", statsController.getVisitorsStats);
router.get("/clients", statsController.getClientsStats);
router.get("/categories", statsController.getCategoriesStats);
router.get("/types", statsController.getTypesStats);
router.get("/orders", statsController.getOrdersStats);


module.exports = router;
