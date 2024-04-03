const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.post("/register", userController.register);

router.post("/login", userController.login);

module.exports = router;
