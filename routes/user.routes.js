const Router = require("express");

const router = new Router();

const userController = require("../controller/user.controller");

router.post("/otp", userController.createUser);

module.exports = router;
