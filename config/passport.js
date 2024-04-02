const fs = require("fs");
const path = require("path");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/user");

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// TODO
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub).exec();
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, null);
  }
});

// TODO
module.exports = (passport) => {
  passport.use(strategy);
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await User.findById(userId).exec();
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
