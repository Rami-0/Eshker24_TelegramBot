const Router = require("express");

const router = new Router();

const userController = require("../controller/user.controller");

router.get("/users", (req, res) => {
  res.send("User route");
});

router.post("/otp", userController.createOTP);
router.post("/init", userController.init);

module.exports = router;
