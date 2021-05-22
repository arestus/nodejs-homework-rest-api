const Joi = require("joi");

const schemaAddContact = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": `LARISA NE DOBIVAY MENYA PLS`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "any.required": `"email" is a required field`,
    })
    .required(),
  phone: Joi.string().min(6).max(20).required().messages({
    "any.required": `"phone" is a required field`,
  }),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": `"name" is a required field`,
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "any.required": `"email" is a required field`,
    })
    .required(),
  phone: Joi.string().min(6).max(20).required().messages({
    "any.required": `"phone" is a required field`,
  }),
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
  validationAddContact: (req, res, next) => {
    return validate(schemaAddContact, req.body, next);
  },
  validationUpdateContact: (req, res, next) => {
    return validate(schemaUpdateContact, req.body, next);
  },
};
