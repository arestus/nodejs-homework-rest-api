const passport = require("passport");
require("../config/passport");
const { HttpCode } = require("./constants");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const headerAuth = req.get("Authorization");
    let token = null;
    if (headerAuth) {
      token = headerAuth.split(" ")[1];
      console.log(headerAuth);
    }
    if (err || !user || token !== user?.token) {
      console.log(!user);
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
