const Joi = require('joi');

const validateRegisterInput = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    vacationType: Joi.string().valid('Solo', 'Partner', 'Family').required(),
    partnerInfo: Joi.object({
      name: Joi.string(),
      age: Joi.number(),
      travelPreferences: Joi.string(),
    }),
    kidsInfo: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        age: Joi.number(),
        interests: Joi.string(),
      })
    ),
  });
  return schema.validate(data);
};

const validateLoginInput = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateProfileInput = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    vacationType: Joi.string().valid('Solo', 'Partner', 'Family').optional(),
    partnerInfo: Joi.object({
      name: Joi.string(),
      age: Joi.number(),
      travelPreferences: Joi.string(),
    }).optional(),
    kidsInfo: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        age: Joi.number(),
        interests: Joi.string(),
      })
    ).optional(),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateProfileInput,
};
