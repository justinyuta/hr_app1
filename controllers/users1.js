var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const database = require('../services/database.js');

   
  async function post(req, res, next) {
    var user = {
        email: req.body.email,
        password: req.body.password
    };

    var unhashedPassword = req.body.password;
 
    await bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
 
        bcrypt.hash(unhashedPassword, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.hashedPassword = hash;             
        });
    });


    res.status(200).json({
        user: user
    });

  }
   
  module.exports.post = post;
  

