const express = require("express");
const passport = require("passport");

const commentController = require("../controllers/commentController");

const router = express.Router();

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  commentController.new_comment
);

router.delete(
  "/:commentId/delete",
  passport.authenticate("jwt", { session: false }),
  commentController.delete_comment
);

module.exports = router;