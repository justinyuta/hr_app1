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

            const insert_sql = 
            'insert into jsao_users ( ' +
            '   email, ' +
            '   password, ' +
            '   role ' +
            ') ' +
            'values (' +
            '    :email, ' +
            '    :password, ' +
            '    \'BASE\' ' +
            ') ' +
            'returning ' +
            '   id, ' +
            '   email, ' +
            '   role ' +
            'into ' +
            '   :rid, ' +
            '   :remail, ' +
            '   :rrole';
            
            const binds =  {
                email: user.email.toLowerCase(),
                password: user.hashedPassword,
                rid: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_OUT
                },
                remail: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                },
                rrole: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                }
                };
    
            opts = { autoCommit: true};

            const results = database.simpleExecute(insert_sql, binds, opts);

            user.role = 'BASE';
    
            res.status(200).json({
                user: user
            });
        
        });
    });



  }
   
  module.exports.post = post;
  

