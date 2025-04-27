const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  parentId: Joi.number().integer().optional(),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  parentId: Joi.number().integer().optional(),
  userId: Joi.number().integer().optional(),
});

module.exports = {
  categorySchema,
  categoryUpdateSchema,
};
