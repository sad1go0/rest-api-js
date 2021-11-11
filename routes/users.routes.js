const { Router } = require('express');
const { pick } = require('lodash');
const { genSalt, hash } = require('bcrypt');
const { User, validateUser } = require('../models/user.models');
const router = Router();

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isUser = await User.findOne({ email: req.body.email });
  if (isUser) return res.status(400).send('Mavjud bo\'lgan foydalanuvchi');

  let user = new User(pick(req.body, ['name', 'email', 'password']));

  const salt = await genSalt();
  user.password = await hash(user.password, salt);

  user = await user.save();

  res.send(pick(user, ['_id', 'name', 'email']));
})

module.exports = router;