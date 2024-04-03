const User = require("../models/user");

module.exports.isUsernameInUse = async function isUsernameInUse(username) {
  const user = await User.findOne({ username }).exec();
  if (user) {
    throw new Error("El nombre de usuario ya se encuentra en uso");
  }
};

module.exports.validateConfirmPassword = function validateConfirmPassword(
  confirmPassword,
  { req }
) {
  return confirmPassword === req.body.paswword;
};
