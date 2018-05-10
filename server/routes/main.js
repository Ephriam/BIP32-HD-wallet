var express = require("express");
var router = express.Router();

var auth = require('../Controllers/authController');
var userController = require('../Controllers/userController');
var walletController = require('../Controllers/walletController');

router.get('/get_user', auth.tokenChecker, (req, res) => {
    userController.findUser(req.id).then((user) => {
        res.json({msg: user})});  
});

router.get('/', (req, res) => {
    res.json({msg:'auth'});
});

router.post('/send_transaction', auth.tokenChecker, (req, res) =>{
    console.log(req.body.tx)
    if(req.body.tx.coin == 'BTCTEST'){
        walletController.sendBitcoinTransaction(req.body.tx, req.id, res);
    }else if(req.body.tx.coin == 'LTCTEST'){
        walletController.sendLitecoinTransaction(req.body.tx, req.id, res);
    }
});

router.post('/get_balance',  auth.tokenChecker, (req, res) => {
    let utxos, balance;   
    walletController.getUtxos(req.body.address, req.body.coin).then((body) =>
    {   console.log(body)
        utxos = body.data.txs; 
        balance = walletController.getBalanceFromUtxoChain(utxos)
        console.log(balance)
        res.json({msg: balance})}).catch((err)=>{console.log(err);res.json({err:'error'})})
})

router.post('/get_utxos', auth.tokenChecker, (req, res) => {
    walletController.getUtxos(req.body.address, req.body.net).then((body) =>
    {res.json({msg: body})}).catch((err)=>{console.log(err);res.json({err:'error'})})
})


module.exports = router;