const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const createItemValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2 characters",
      "string.max": "The maximum length of the 'name' field is 30 characters",
      "string.empty": "The 'name' field is required",
    }),
    weather: Joi.string().required.valid("hot", "warm", "cold"),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
  }),
});

const userBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the 'name' field is 2 characters",
      "string.max": "The maximum length of the 'name' field is 30 characters",
      "string.empty": "The 'name' field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

const userProfileInfoBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "avatar url" field must be filled in',
      "string.uri": 'The "avatar url" field must be a valid url',
    }),
  }),
});

const userAuthenticationValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required.email().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.empty": "The 'id' field must be filled in",
      "string.length": "The 'id' field must have a length of 24",
    }),
  }),
});

module.exports = {
  createItemValidator,
  userBodyValidator,
  userProfileInfoBodyValidator,
  userAuthenticationValidator,
  validateId,
};
