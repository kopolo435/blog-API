const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const {
  isUsernameInUse,
  validateConfirmPassword,
} = require("../lib/customValidator");
const User = require("../models/user");
const { issueJWT } = require("../lib/utils");

module.exports.register = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 1 y 30 caracteres")
    .custom(isUsernameInUse)
    .withMessage("El nombre de usuario escogido, ya se encuentra registrado"),
  body("password")
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar la contraseña"),
  body("confirmPassword")
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe confirmar la contraseña")
    .custom(validateConfirmPassword)
    .withMessage("Las contraseñas no coinciden"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Invalid form values",
        errors: errors.mapped(),
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        throw err;
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      });

      await user.save();
      res.status(200).json({ success: true, msg: "User created" });
    });
  }),
];

module.exports.login = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 1 y 30 caracteres"),
  body("password")
    .escape()
    .isLength({ min: 1 })
    .withMessage("Debe ingresar la contraseña"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Invalid form values",
        errors: errors.mapped(),
      });
    }
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Username does not exist" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        msg: "Wrong, password",
        errors: { password: "Error, la contraseña es incorrecta" },
      });
    }
    const tokenObject = issueJWT(user);
    return res.status(200).json({
      success: true,
      msg: "Login Success",
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
    });
  }),
];
