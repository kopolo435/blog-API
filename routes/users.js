const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.get("/register", userController.register);

router.post("/login", userController.login);

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are authenticated" });
  }
);

module.exports = router;
