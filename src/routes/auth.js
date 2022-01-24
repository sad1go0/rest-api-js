const { Router } = require('express');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes')
const { User } = require('../models/user');
const { compare } = require('bcrypt');

const router = Router();

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(StatusCodes.BAD_REQUEST).send('Email or password is invalid');

  const isValidPassword = await compare(req.body.password, user.password);
  if (!isValidPassword) return res.status(StatusCodes.BAD_REQUEST).send('Email or password is invalid');

  res.status(StatusCodes.OK).send(true);
})

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  })

  return schema.validate(user);
}

module.exports = router;