/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');

/*** Custom imports ***/
const authController = require("../Controllers/authController");

/***   ROUTE: /api/auth/*     ***/

router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;
