const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const EmailService = require("../services/email");
const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const {
  CreateSenderSendGrid,
  CreateSenderNodemailer,
} = require("../services/email-sender");

require("dotenv").config();

const UploadAvatarService = require("../services/cloud-upload");

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
    const { name, email, subscription, avatar, verifyToken } =
      await Users.create(req.body);

    try {
      const emailService = new EmailService(
        req.app.get("env"),
        new CreateSenderSendGrid()
      );
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.response);
      console.log("Request error:", error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { email, name, subscription, avatar },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    const { id, email, subscription } = user;
    const payload = { id, test: "Larisa the best" };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "4h" });
    await Users.updateToken(id, token);
    return res.json({
      status: "success",
      code: HttpCode.OK,
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
    const { email, subscription } = req.user;
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const updateStatusUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await Users.updateUserSubscription(id, req.body);
    const { email, subscription } = user;
    if (user) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        payload: { email, subscription },
      });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService();
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    );

    await fs.unlink(req.file.path);
    await Users.updateAvatar(id, avatarUrl, idCloudAvatar);
    res.json({ status: "success", code: 200, data: { avatarUrl } });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.token);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { message: "Verification successful" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Verification token isn't valid",
    });
  } catch (error) {
    next(error);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { name, email, verify, verifyToken } = user;
      if (!verify) {
        const emailService = new EmailService(
          req.app.get("env"),
          new CreateSenderSendGrid()
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: "success",
          code: HttpCode.OK,
          data: { message: "Verification email sent" },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Verification has already been passed",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  updateStatusUser,
  verify,
  repeatEmailVerification,
};
