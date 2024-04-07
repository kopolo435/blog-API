const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const deleteComments = require("../lib/deleteComments");

module.exports.publish_new_post = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el titulo")
    .isLength({ max: 30 })
    .withMessage("EL titulo no debe ser mayor a 30 caracteres"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el contenido del post"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        succes: false,
        msg: "Invalid form value",
        errors: errors.mapped(),
      });
    }

    const date = new Date();

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      published_date: date,
      is_published: true,
    });
    if (req.body.lasEdit) {
      post.last_edit = req.body.lasEdit;
    } else {
      post.last_edit = date;
    }

    await post.save();
    res.status(200).json({ success: true, msg: "New post published" });
  }),
];

module.exports.save_post = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el titulo")
    .isLength({ max: 30 })
    .withMessage("EL titulo no debe ser mayor a 30 caracteres"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el contenido del post"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        succes: false,
        msg: "Invalid form value",
        errors: errors.mapped(),
      });
    }

    const date = new Date();

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      last_edit: date,
      is_published: false,
    });

    await post.save();
    res.status(200).json({ success: true, msg: "Post saved as unpublished" });
  }),
];

module.exports.edit_post = [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el titulo")
    .isLength({ max: 30 })
    .withMessage("EL titulo no debe ser mayor a 30 caracteres"),
  body("content")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el contenido del post"),
  body("isPublished")
    .isLength({ min: 1 })
    .withMessage("Debe colocar el estado de publicacion"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        succes: false,
        msg: "Invalid form value",
        errors: errors.mapped(),
      });
    }

    const date = new Date();

    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      last_edit: date,
      is_published: req.body.isPublished === "true",
    });
    try {
      await Post.findByIdAndUpdate(req.params.id, post);
      res.status(200).json({ success: true, msg: "Post updated succesfully" });
    } catch (err) {
      res.status(500).json({ success: false, msg: "Post failed to update" });
    }
  }),
];

module.exports.get_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();

  if (!post) {
    return res
      .status(400)
      .json({ success: false, msg: "Could not find a post with the given id" });
  }
  return res
    .status(200)
    .json({ success: true, msg: "Post find succesfully", post: post._doc });
});

module.exports.get_published_posts = asyncHandler(async (req, res, next) => {
  const postList = await Post.find({ is_published: true })
    .sort({ published_date: -1 })
    .exec();

  return res.status(200).json({
    success: true,
    msg: "Posts list retrieved successfully",
    postList,
  });
});

module.exports.delete_post = asyncHandler(async (req, res, next) => {
  const postComments = await Comment.find({ post_parent: req.params.id });
  await Promise.all([
    Post.findByIdAndDelete(req.params.id),
    deleteComments(postComments),
  ]);
  return res
    .status(200)
    .json({ success: true, msg: "Post and comments deleted successfully" });
});
