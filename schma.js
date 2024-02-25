const Joi = require("joi");

module.exports.EventSchema = Joi.object({
  event: Joi.object({
    committee_id: Joi.string().required(), 
    name: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().iso().required(),
    approval_status: Joi.string().valid('Pending', 'Approved', 'Rejected').default('Pending'),
    occupancy: Joi.number().integer().min(0).required(),
    roomtype: Joi.string().valid('Confrence', 'Auditorium', 'Labs', 'Other').default('Other'),
  }).required()
});
