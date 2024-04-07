const express = require("express");
const passport = require("passport");

const commentController = require("../controllers/commentController");
const isAdmin = require("./isAdmin");

const router = express.Router();

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  commentController.new_comment
);

router.delete(
  "/:commentId/delete",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  commentController.delete_comment
);

module.exports = router;
