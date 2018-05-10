var bitcore = require('bitcore-lib');
var explorer = require('bitcore-explorers');
var HDPrivateKey = bitcore.HDPrivateKey;
var Address = bitcore.Address;
var Networks = bitcore.Networks;
var testnetInsight = new explorer.Insight('https://test-insight.bitpay.com');
var Transaction = bitcore.Transaction;
var User = require('../models/User');
var xPrivateKey = HDPrivateKey('xprv9s21ZrQH143K3MxnZ8MpmLN3bTkqL5bECUqrhkMaK4qCLdniXXTa1UJTvXgupXUkp2WKQzDefv5Wdv4NEijKQ1h6an6c5H9ppH5E1D7jMn1');
var xPublicKey = xPrivateKey.hdPublicKey;
var LitecoinInsight = 'https://insight.litecore.io/api/'
var ChainInsight = 'https://chain.so/api/v2/'
var Litecoin = require('litecore-lib')
var request = require('request')

unit = bitcore.Unit;

exports.newAddress = function(id){
    User.findById(id)
    .then((user) => {
        user.bitcoinAddress = Address(xPrivateKey.derive("m/"+user.index).publicKey, Networks.livenet)
        user.testnetBitcoinAddress = Address(xPrivateKey.derive("m/"+user.index).publicKey, Networks.testnet)
        user.litecoinAddress = Address(xPrivateKey.derive("m/"+user.index).publicKey, Networks.livenet)
        user.testnetLitecoinAddress = Address(xPrivateKey.derive("m/"+user.index).publicKey, Networks.testnet)
        user.save()
        .then((user) =>{console.log({msg:{user: user}})})
        .catch((err) => {console.log({msg:{error: err}})})   
    });
}

exports.getUtxos = function(address, net){
    console.log(ChainInsight + 'get_tx_unspent/' + net + '/' + address)
    return new Promise((resolve, reject) => {
        request({
            uri: ChainInsight + 'get_tx_unspent/' + net + '/' + address,
            json: true
          },
            (error, response, body) => {
              if(error) reject(error);
              resolve(body)}
          )
    })
}

var getUtxosChain = function(address, net){
    console.log(ChainInsight + 'get_tx_unspent/' + net + '/' + address)
    return new Promise((resolve, reject) => {
        request({
            uri: ChainInsight + 'get_tx_unspent/' + net + '/' + address,
            json: true
          },
            (error, response, body) => {
              if(error) reject(error);
              resolve(body)}
          )
    })
}

var formatedUtxos = function(utxos){
    let formatedUtxos = []
    for(i=0; i<utxos.data.txs.length; i++){
        let temp ={txid: utxos.data.txs[i].txid, vout: utxos.data.txs[i].output_no, scriptPubKey: utxos.data.txs[i].script_hex, satoshis: parseInt(utxos.data.txs[i].value*100000000)}
        formatedUtxos.push(temp)
    }
    return formatedUtxos
}

var getBalanceFromUtxos = function(utxos){
    let balance = 0;
        for (var i = 0; i < utxos.length; i++) {
          balance +=utxos[i]['satoshis'];
        }
    return balance;
}

exports.getBalanceFromUtxoChain = function(utxos){
    let balance = 0;
    for(var i = 0; i<utxos.length; i++){
        balance += utxos[i]['value']
    }
    return balance;
}

var sendRawtxChain = function(rawtx, net){
    console.log(ChainInsight + 'send_tx/' + net)
    return new Promise((resolve, reject)=>{
        request.post(ChainInsight + 'send_tx/' + net,
        {form:{tx_hex: rawtx}}, (error, response, body) => {
            if(error) reject(error);
            resolve(body)})

    })
}

exports.sendBitcoinTransaction = function(_tx, id, res){
    console.log('btc transaction')
    User.findById(id).then((user) => {
    testnetInsight.getUnspentUtxos(user.testnetBitcoinAddress, function(err, utxos){
    if((err == null)&&(getBalanceFromUtxos(utxos)-unit.fromBTC(_tx.amount).toSatoshis()-1000)>0){
         var tx = Transaction()
        .from(utxos)
        .to(_tx.to, unit.fromBTC(_tx.amount).toSatoshis())
        .fee(1000)
        .change(user.testnetLitecoinAddress)
        .sign(xPrivateKey.derive("m/"+user.index).privateKey)
        if(tx.getSerializationError()){
            console.log('Serialization error');
            console.log(tx.getSerializationError().message);
            return;
        }
            testnetInsight.broadcast(tx, function(error, body) {
                if (error) {
                  console.log('Error in broadcast: ' + error);
                } else {console.log(body);}
            });
    }else{console.log(err + 'Or you dont have sufficent funds for this transaction');}
    });}).catch((err) => {console.log(err)});
}

exports.sendLitecoinTransaction = function(_tx, id, res){
    User.findById(id).then((user) => {
    getUtxosChain(user.testnetLitecoinAddress, 'LTCTEST')
    .then((utxos)=>{
        if(utxos){
        utxos = formatedUtxos(utxos)
        console.log(getBalanceFromUtxos(utxos)-unit.fromBTC(_tx.amount).toSatoshis()-1000)
        if(getBalanceFromUtxos(utxos)-unit.fromBTC(_tx.amount).toSatoshis()-1000>0){
        var tx = Litecoin.Transaction()
        .from(utxos)
        .fee(bitcore.Unit.fromMilis(0.1).toSatoshis())
        .to(_tx.to, unit.fromBTC(_tx.amount).toSatoshis())
        .change(user.testnetLitecoinAddress)
        .sign(xPrivateKey.derive("m/"+user.index).privateKey)
        res.json({msg1: tx})
        if(tx.getSerializationError()){
            console.log('Serialization error');            
            console.log(tx.getSerializationError().message);
            return;}
        sendRawtxChain(tx.toString(), 'LTCTEST').then((body) => {
            res.json({msg:body})})
            .catch((err) => {console.log(err)})
        }else{console.log('insufisunt funds')}
        }}).catch((err)=>{console.log(err+'get utxos ltc')})
    }).catch('cound not find user')
}

exports.getBalance = function (req, res){
    User.findById(req.id).then((user) =>{
        testnetInsight.getUnspentUtxos(user.testnetBitcoinAddress, function(err, utxos){
            let balance = 0;
            if(utxos){
             for (var i = 0; i < utxos.length; i++) {
            balance +=utxos[i]['satoshis'];
            }
            res.json({msg: balance});
            }else{res.json({err: 'c'})}
            console.log(utxos)
            console.log(balance);
            
        });
    });
}

exports.getLitecoinUtxos = function(address){
    return new Promise((resolve, reject) => {
        request({
            uri: ChainSoInsight + 'get_tx_unspent/LTCTEST/' + address,
            json: true
          },
            (error, response, body) => {
              if(error) reject(error);
              resolve(body)}
          )
    })
}











