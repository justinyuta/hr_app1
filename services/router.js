const express = require('express');
const router = new express.Router();
const employees = require('../controllers/employees.js');
const users = require('../controllers/users.js');
const login = require('../controllers/login.js');
const auth = require('../controllers/auth.js');

router.route('/employees/:id?')
  .get(auth(),employees.get)
  .post(auth('ADMIN'),employees.post)
  .put(auth('ADMIN'),employees.put)
  .delete(auth('ADMIN'),employees.delete);


router.route('/users')
  .post(auth('ADMIN'),users.post);

router.route('/login')
  .post(login.post);


module.exports = router;

