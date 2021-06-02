const passport = require("passport");
var { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../model/user");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const Users = require("../repositories/users");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(new Error("User not found"));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);
