const { Router } = require('express');
const { StatusCodes } = require('http-status-codes')
const { User, validateUser } = require('../models/user');
const { genSalt, hash } = require('bcrypt');
const { pick } = require('lodash');

const router = Router();

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(StatusCodes.BAD_REQUEST).send('User is already exists');

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  const salt = await genSalt();
  user.password = await hash(user.password, salt);

  user = await user.save();

  res.status(StatusCodes.CREATED).send(pick(user, ['_id', 'name', 'email']));
})

module.exports = router;