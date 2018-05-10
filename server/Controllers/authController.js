var jwt = require('jsonwebtoken');

exports.tokenChecker = function(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.id = decoded.id;
        next();
    }catch(err){
		console.log(err);
        return res.json({err: err});
    }
};

exports.decoder = function(token, id){
	console.log(token);
	if(token){
		jwt.verify(token, 'secret', function(err ,decoded){
			if(err){console.log('token error');}
			else{
				id(decoded.id);
			}
		});
	}else{
		id('no token found');
	}
}