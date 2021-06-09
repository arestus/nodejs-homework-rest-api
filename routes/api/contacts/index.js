const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateStatusContact,
} = require("./validation");

router.get("/", guard, ctrl.getAllContacts);

router.get("/:id", guard, ctrl.getContactById);

router.post("/", guard, validationAddContact, ctrl.addContact);

router.delete("/:id", guard, ctrl.deleteById);

router.put("/:id", guard, validationUpdateContact, ctrl.updateContact);

router.patch(
  "/:id/favorite",
  validationUpdateStatusContact,
  guard,
  ctrl.updateStatusContact
);

module.exports = router;
