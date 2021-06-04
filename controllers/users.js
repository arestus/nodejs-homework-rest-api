const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const { subscription, email } = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "succes",
      code: HttpCode.CREATED,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    const { id, email, subscription } = user;
    const payload = { id, test: "Larisa the best" };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.json({
      status: "succes",
      code: 200,
      data: { token, user: { email, subscription } },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({
      Status: "success",
      code: HttpCode.NO_CONTENT,
    });
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    // const user = await Users.findByEmail(req.body.email);
    // // const { email, subscription } = user;
    // const subscription = req.user.subscription;
    const { email, subscription } = req.user;
    // await Users.updateToken(id, null);
    return res.json({
      status: "succes",
      code: HttpCode.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { signup, login, logout, current };
