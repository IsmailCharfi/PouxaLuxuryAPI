/*** Third-Party imports ***/
const router = require("express").Router();
const { check } = require('express-validator');

/*** Custom imports ***/
const usersController = require("../Controllers/usersController");

/***   ROUTE: /api/users/*     ***/

router.get("/", usersController.getUsers);
router.get("/:uid", usersController.getUserById);
router.post("/", usersController.createUser);
router.patch("/:uid", usersController.updateUser);
router.delete("/:uid", usersController.deleteUser);

module.exports = router;
