var User = require('../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.userNameNotFound = function(user_name){
    var promise = new Promise((resolve, reject) => {
        User.find({user_name: user_name})
            .then(data => {if(data.length>=1){console.log('user found'); reject('u');}
                else{resolve()}
         }); 
    });
    return promise;
}             

exports.emailFound = function(email){
    var promise = new Promise((resolve, reject) => {
        User.find({email: email})
            .then(data => {if(data.length>=1){console.log('email found');reject('e')}
                else{resolve();}
            });
    });
    return promise;
}

exports.createNewUser = function(req){
    var promise = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
            let newUser = new User({
                user_name: req.body.user_name,
                email: req.body.email,
                password: hash
            }); 
            newUser.save()
            .then(user => {user.password = undefined; 
                user.index = undefined; 
                resolve(user)})
            .catch(err => {console.log('registration err'+err); reject('r')});
        });});
    });
    return promise;
}

exports.findAllUser = function(res){
    var promise = new Promise(function(resolve, reject){
        User.find()
        .then(user => {user[0].password = undefined; resolve(user)})
        .catch(err => {reject(err);});

    })
    return promise;    
}

exports.loginUser = function(req){
    var promise = new Promise(function(resolve, reject){
        User.findOne({user_name: req.body.user_name})
        .then((user) => {
            if(user!=null){
            bcrypt.compare(req.body.password, user.password, (err, res) => {
                if(res){
                let token = jwt.sign({
                    id: user._id
                }, 'secret', { expiresIn: '1h' });
                resolve(token);
            }else{console.log('Auth err'+err);reject('i');}
            });
            }else{console.log('No such user');reject('n');}
        });
    });    
    return promise;
}

exports.deleteUser = function(id, res){
    User.findByIdAndRemove(id)
    .then(data => {res.json({msg: {id: id}})})
    .catch(err => {cosole.log(err)});
}

exports.findUser = function(id){
    let promise = new Promise(function(resolve, reject){
        User.findOne({_id: id})
        .then((user) =>{
            user.password = undefined;
            resolve(user);
        }).catch((err) => {console.log(err);})
    });
    return promise;
}