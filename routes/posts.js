const express = require("express");
const passport = require("passport");

const postController = require("../controllers/postController");

const router = express.Router();

router.get("/", postController.get_published_posts);

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

router.get("/:id", postController.get_post);

router.put(
  "/:id/edit",
  passport.authenticate("jwt", { session: false }),
  postController.edit_post
);

router.delete(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }),
  postController.delete_post
);

module.exports = router;
