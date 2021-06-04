const Joi = require("joi");

const schemaUserRegistration = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(3).max(15).required().messages({
    "any.required": "missing required password field",
  }),
});

const schemaUserLogin = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(3).max(15).required().messages({
    "any.required": "missing required password field",
  }),
});

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
}).messages({
  "any.required": "missing field favorite",
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationUserRegistration: (req, res, next) => {
    return validate(schemaUserRegistration, req.body, next);
  },
  validationUserLogin: (req, res, next) => {
    return validate(schemaUserLogin, req.body, next);
  },
  validationUpdateStatusContact: (req, res, next) => {
    return validate(schemaUpdateStatusContact, req.body, next);
  },
};
