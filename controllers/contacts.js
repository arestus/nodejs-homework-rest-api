const Contacts = require("../repositories/contacts");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.id);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not Found!" });
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.id);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: { contact },
        message: "contact deleted",
      });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.id, req.body);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateStatusContact(req.params.id, req.body);
    if (contact) {
      return res.json({ status: "success", code: 200, data: { contact } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  deleteById,
  updateContact,
  updateStatusContact,
};
