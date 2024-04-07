function isAdmin(req, res, next) {
  if (req.user.is_admin) {
    return next();
  }
  return res
    .status(401)
    .json({ success: false, msg: "User does not have admin rights" });
}

module.exports = isAdmin;
