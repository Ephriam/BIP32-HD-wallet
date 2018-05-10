//import { Address, PublicKey } from 'bitcore-lib';
var bitcoreLib = require('bitcore-lib');
var explorer = require('bitcore-explorers');

var liveInsight = new explorer.Insight();
var testInsight = new explorer.Insight('https://test-insight.bitpay.com');

var shell = {};
//var addrInfo = {};
//var tx = {};

//var password = 'alwaysbecoddingscreencast';
var password = 'AlwaysBCoding!BitcoinScreencast1'.repeat(1161);
//var pKey = bitcoreLib.PrivateKey(bitcoreLib.crypto.BN.fromBuffer(
 //   bitcoreLib.crypto.Hash.sha256(new Buffer(password))));
//var address = pKey.toAddress();

//var publicKey = bitcoreLib.PublicKey(pKey);

var laddress = function(publicKey, cb){
    add = new bitcoreLib.Address(publicKey, bitcoreLib.Networks.livenet);
    cb(add);
}

var taddress = function(publicKey, cb){
    add = new bitcoreLib.Address(publicKey, bitcoreLib.Networks.testnet);
    cb(add);
}

var keyPairGen = function (pass,cb){
    let pKey = bitcoreLib.PrivateKey(bitcoreLib.crypto.BN.fromBuffer(
        bitcoreLib.crypto.Hash.sha256(new Buffer(pass))));    
    let publicKey = bitcoreLib.PublicKey(pKey);
    cb(pKey, publicKey);
}

var adderInfo = function(addr, cb){
    let addrInfo = {};
    testInsight.getUnspentUtxos(addr, function(error, utxos) {
        addrInfo.utxos = utxos;
        let balance = 0;
        for (var i = 0; i < utxos.length; i++) {
          balance +=utxos[i]['satoshis'];
        }
        addrInfo.balance = balance;
        console.log('balance:'+ balance);
        cb(addrInfo);
    }); 
}

var sendTestBitcoins = function(from, to, amount, pKey, minerFee, cb){
    if(!bitcoreLib.Address.isValid(from)){
        return 'Address checksum failed';
    }
    if(!bitcoreLib.Address.isValid(to)){
        return 'Address checksum failed';
    }
    adderInfo(from, function(addrInfo){
        if ((addrInfo.balance - amount - minerFee) > 0) {
            try{
                let tx = new bitcoreLib.Transaction()
                    .from(addrInfo.utxos)
                    .to(to, amount)
                    .fee(minerFee)
                    .change(from)
                    .sign(pKey);
                if(tx.getSerializationError()){
                    //cb(tx.getSerializationError().message, null);
                    console.log(tx.getSerializationError().message);
                    return;
                }
                //console.log(tx);
                cb(tx);
                testInsight.broadcast(tx, function(error, body) {
                    if (error) {
                      console.log('Error in broadcast: ' + error);
                    } else {console.log(body);}
                });
      
            }catch(err){
                //cb(err.message, null);
                console.log(err.message);
                return;
            }
        }else{
            cb("You don't have enough Satoshis to cover the miner fee.");
        }
    });
}
unit =bitcore.Unit;
var to, amount, mf, ta1, pk1, puk1;
to = 'myW8VUJnRWUHWnntGk6pBwM1TANd3xxQa5,';
amount = unit.fromBTC(0.1).toSatoshis();
mf = unit.fromMilis(0.1).toSatoshis();
keyPairGen(password, (a, b)=>{
    pk1 = a;
    puk1 = b
});
taddress(puk1, (a)=>{ta1=a});
sendTestBitcoins(ta1, to, amount, pk1, mf, (a) => {shell = a});
console.log(shell);

//post('https://api.blockcypher.com/v1/bcy/test/txs/push', JSON.stringify(pushtx))
 // .then(function(d) {console.log(d)});

 var blockio = 'mudh6t6R52eiVFKetDwbNprQuFHCrP3AqA';