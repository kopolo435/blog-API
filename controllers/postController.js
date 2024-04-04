const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

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
      last_edit: date,
      is_published: true,
    });

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
  body("postId")
    .isLength({ min: 1 })
    .withMessage("Debe ingresar el id del post a editar"),
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
      _id: req.body.postId,
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      last_edit: date,
      is_published: req.body.isPublished === "true",
    });
    try {
      await Post.findByIdAndUpdate(req.body.postId, post);
      res.status(200).json({ success: true, msg: "Post updated succesfully" });
    } catch (err) {
      res.status(500).json({ success: false, msg: "Post failed to update" });
    }
  }),
];
