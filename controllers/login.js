var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');
const database = require('../services/database.js');

// 20201026 - Justin - Chnage to use service/database.js simpleExecute function 
function post(req, res, next) {

    const select_sql = 
    'select id as "id", ' +
    '   email as "email", ' +
    '   password as "password", ' +
    '   role as "role" ' +
    'from jsao_users ' +
    'where email = :email';
    
    const binds =  {
        email: req.body.email.toLowerCase()
    };

    opts = {
        outFormat: oracledb.OBJECT
    };

    console.log('Binds:');
    console.log(binds);

    const results = database.simpleExecute(select_sql, binds, opts).then(function(results){
//        console.log('SQL Result :');
//        console.log(results);
        var user;     
        user = results.rows[0];
        if (typeof user==='undefined') {
            res.status(401).send({message: 'No user email is '+req.body.email});
            return;
        }
//        console.log('login user :');
//        console.log(user);
//        console.log('req.body :');
//        console.log(req.body);
     
        bcrypt.compare(req.body.password, user.password, function(err, pwMatch) {
            var payload;
            if (err) {
                return next(err);
            }
            if (!pwMatch) {
                res.status(401).send({message: 'Invalid email or password.'});
                return;
            }
 
            payload = {
                sub: user.email,
                role: user.role
            };
 
            res.status(200).json({
                user: user,
                token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
            });
        });
    }, function(err){
        console.log('Database execute error /login :');
        console.log(err);
        return next(err);
    });
}
 
module.exports.post = post;

