// validation
const Joi = require("@hapi/joi");

// register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    country: Joi.string().min(4).required(),
    number: Joi.string()
      .regex(/^[0-9]+$/)
      .min(11)
      .required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "Passwords do not match" }),
  });

  return schema.validate(data);
}

// login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required()
  });

  return schema.validate(data);
}



const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .messages({ "any.only": "Passwords do not match" }),
    resetPasswordToken: Joi.string().required()
  });
  return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

module.exports.resetPasswordValidation = resetPasswordValidation;
