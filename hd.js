global.bitcore = require('bitcore-lib');
global.explorer = require('bitcore-explorers');

global.liveInsight = new explorer.Insight();
global.testInsight = new explorer.Insight('https://test-insight.bitpay.com');
global.HDPrivateKey = bitcore.HDPrivateKey;
global.Address = bitcore.Address;
global.Networks = bitcore.Networks;
global.Transaction = bitcore.Transaction;
global.xPrivateKey = HDPrivateKey('xprv9s21ZrQH143K3MxnZ8MpmLN3bTkqL5bECUqrhkMaK4qCLdniXXTa1UJTvXgupXUkp2WKQzDefv5Wdv4NEijKQ1h6an6c5H9ppH5E1D7jMn1');
global.xPri = HDPrivateKey('xprv9s21ZrQH143K26sPr45RvdFrvse9cqDaa5SdZo3wHh2V5ZwsuD1YCYzvQ7LQSQTJdhZRnbqUsSRNKEhAFm4vMARzYY2zwdGV15fMQ9caims');
global.xPri2 = HDPrivateKey('xprv9s21ZrQH143K3MxnZ8MpmLN3bTkqL5bECUqrhkMaK4qCLdniXXTa1UJTvXgupXUkp2WKQzDefv5Wdv4NEijKQ1h6an6c5H9ppH5E1D7jMn1');
global.xPub = xPri.hdPublicKey;
global.xPub2 = xPri2.hdPublicKey;

global.laddress = Address(xPub.publicKey, Networks.livenet);
global.taddress = Address(xPub.publicKey, Networks.testnet);
global.taddress2 = Address(xPub2.publicKey, Networks.testnet);

global.unit = bitcore.Unit;

global.shell = {};

global.adderInfo = function(addr, cb){
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

global.sendTestBitcoins = function(cb){
    from = 'myFMUtFkZWQUhKbBS8zkY5J7zZNBcMbRu2';
    to = 'mpxLeWC9D4wxrtmkAve3UCobyagCBiXePc';
    amount = 100000;
    pKey = xPrivateKey.derive("m/9").privateKey;
    minerFee = 1000;
    if(!bitcore.Address.isValid(from)){
        return 'Address checksum failed';
    }
    if(!bitcore.Address.isValid(to)){
        return 'Address checksum failed';
    }
    adderInfo(from, function(addrInfo){
        if ((addrInfo.balance - amount - minerFee) > 0) {
            try{
                let tx = new bitcore.Transaction()
                    .from(addrInfo.utxos)
                    .to(to, amount)
                    .fee(minerFee)
                    .change(from)
                    .sign(pKey);
                if(tx.getSerializationError()){
                    //cb(tx.getSerializationError().message, null);
                    console.log('Serialization error');
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


global.sendBitcoinTransaction = function(){
    console.log('btc transaction')
    adderInfo('myFMUtFkZWQUhKbBS8zkY5J7zZNBcMbRu2', function(addrInfo){
        var tx = new bitcore.Transaction()
        .from(addrInfo.utxos)
        .to('mpxLeWC9D4wxrtmkAve3UCobyagCBiXePc', unit.fromBTC(1.7).toSatoshis())
        .fee(1000)
        .change('myFMUtFkZWQUhKbBS8zkY5J7zZNBcMbRu2')
        .sign(xPrivateKey.derive("m/9").privateKey);
        if(tx.getSerializationError()){
            console.log('Serialization error');
            console.log(tx.getSerializationError().message);
            return;
        }
            testInsight.broadcast(tx, function(error, body) {
                if (error) {
                  console.log('Error in broadcast: ' + error);
                } else {console.log(body);}
            });
    });
}


require('repl').start({});