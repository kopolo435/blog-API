const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { issueJWT } = require("../lib/utils");

module.exports.register = asyncHandler(async (req, res, next) => {
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
    res.send("User created");
  });
});

module.exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username }).exec();
  if (!user) {
    res.status(401).json({ success: false, msg: "Could not validate user" });
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    res.status(401).json({ success: false, msg: "Wrong password" });
  } else {
    const tokenObject = issueJWT(user);
    res.status(200).json({
      success: true,
      msg: "Login Success",
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
    });
  }
});
