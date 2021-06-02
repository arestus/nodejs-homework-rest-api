const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email is already used",
      });
    }
    const { id, name, email } = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "succes",
      code: HttpCode.CREATED,
      data: { id, name, email },
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
    const id = user.id;
    const payload = { id, test: "Larisa the best" };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.udpateToken(id, token);
    return res.json({ status: "succes", code: 200, data: { token } });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const users = await Users.getAll();
    return res.json({ status: "succes", code: 200, data: { cats } });
  } catch (e) {
    next(e);
  }
};

module.exports = { register, login, logout };
