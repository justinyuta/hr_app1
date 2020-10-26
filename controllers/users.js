var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const database = require('../services/database.js');

function post(req, res, next) {
    var user = {
        email: req.body.email,
        password: req.body.password
    };
//    console.log('req.body:');
//    console.log(req.body);

    var unhashedPassword = req.body.password;

    const salt = bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(unhashedPassword, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            user.hashedPassword = hash;

//            console.log('hashedPassword:');
//            console.log(user);  

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
        
//            console.log('Binds:');
//            console.log(binds);
        
            const results = database.simpleExecute(insert_sql, binds, opts).then(function(results){
//                console.log('Result:');
//                console.log(results);
                user.role = 'BASE';
                res.status(200).json({
                    user: user
                });
            }, function(err){
                console.log('Database execute error /user :');
                console.log(err);
                return next(err);
            });        
        });
    }); 

}
   
module.exports.post = post;