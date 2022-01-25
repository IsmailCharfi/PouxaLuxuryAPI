/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');

/*** Custom imports ***/
const statsController = require("../Controllers/statsController");

/***   ROUTE: /api/stats/*     ***/

router.get("/", statsController.getStats);

module.exports = router;
