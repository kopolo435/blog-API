const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment");

module.exports.new_comment = [
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El comentario no puede estar vacio"),
  body("parentType")
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe especificar si se comenta a post o comentario"),
  body("parentId")
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el id del post o comentario al que se comenta"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: true,
        msg: "Error on form values,",
        errors: errors.mapped(),
      });
    }
    const comment = new Comment({
      content: req.body.content,
      published_date: new Date(),
      author: req.user.id,
    });
    if (req.body.parentType === "post") {
      comment.post_parent = req.body.parentId;
    } else {
      comment.comment_parent = req.body.parentId;
    }
    await comment.save();
    return res
      .status(200)
      .json({ success: true, msg: "Commend added succesfully", comment });
  }),
];

module.exports.delete_comment = asyncHandler(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.commentId);
  return res
    .status(200)
    .json({ success: true, msg: "Comment deleted succesfully" });
});
