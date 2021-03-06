const { Schema, model } = require('mongoose');
const Joi = require('joi');

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isVip: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  bonusPoints: {
    type: Number,
    default: 0,
  },
});

const Customer = model('customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isVip: Joi.boolean().required(),
    phone: Joi.string().min(5).max(50).required(),
    bonusPoints: Joi.number().min(0),
  });

  return schema.validate(customer);
}

module.exports = { Customer, validateCustomer };
