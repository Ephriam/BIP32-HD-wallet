var express = require("express");
var router = express.Router();
var path = require('path');

var walletController = require('../Controllers/walletController');
var userController = require('../Controllers/userController');

router.get('/', (req, res) => {
    userController.findAllUser()
    .then(user => {res.json({user})})
    .catch(err => {console.log('get all err')});
});

router.post('/register',(req, res) => {
    Promise.all([userController.userNameNotFound(req.body.user_name),
                 userController.emailFound(req.body.email)])
            .then(user => {userController.createNewUser(req)
                          .then((user) => {
                            walletController.newAddress(user._id);
                            res.json(user)})
                          .catch((err) => {
                              res.json({msg: err});
                          })})
            .catch(err => {console.log('something went wrong');res.json({msg: err})});
});

router.post('/login', (req, res) => {
    userController.loginUser(req)
    .then((token) => {res.json({token: token})})
    .catch((err) => {res.json({err: err})});
});


router.delete('/delete_user/:id', (req, res) => {
    userController.deleteUser(req.params.id, res);
});

router.get('/pic', (req, res) => {
    res.sendFile(path.join(__dirname, '../uploads/', 'images.jpg'))
}); 
module.exports = router;
