const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(20).required(),
  description: Joi.string().min(3).max(100).required(),
  isCompleted: Joi.boolean().required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  categoryId: Joi.number().integer().required(),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(20),
  description: Joi.string().min(3).max(100),
  isCompleted: Joi.boolean().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  categoryId: Joi.number().integer().optional(),
  userId: Joi.number().optional(),
});

module.exports = {
  taskSchema,
  taskUpdateSchema,
};
