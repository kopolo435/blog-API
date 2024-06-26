const express = require("express");
const passport = require("passport");

const postController = require("../controllers/postController");
const isAdmin = require("./isAdmin");

const router = express.Router();

router.get("/", postController.get_published_posts);

router.post(
  "/publish",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postController.publish_new_post
);

router.post(
  "/save",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postController.save_post
);

router.get("/:id", postController.get_post);

router.put(
  "/:id/edit",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postController.edit_post
);

router.delete(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  postController.delete_post
);

router.get("/:id/comments", postController.get_post_comments);

module.exports = router;
