const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

const {
  validationUserRegistration,
  validationUserLogin,
} = require("./validation");

router.post("/signup", validationUserRegistration, ctrl.signup);
router.post("/login", validationUserLogin, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/", guard, ctrl.updateStatusUser);

module.exports = router;
