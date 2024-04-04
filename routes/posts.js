const express = require("express");
const passport = require("passport");

const postController = require("../controllers/postController");

const router = express.Router();

router.post(
  "/publish",
  passport.authenticate("jwt", { session: false }),
  postController.publish_new_post
);

router.post(
  "/save",
  passport.authenticate("jwt", { session: false }),
  postController.save_post
);

router.put(
  "/:id/edit",
  passport.authenticate("jwt", { session: false }),
  postController.edit_post
);

module.exports = router;
