var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var UserSchema = mongoose.Schema({
	user_name:{ type: String, required: true },
	email:{ type: String, required: true },
	password:{ type: String, required: true	},
	profileUrl:{ type: String, required: false },
	bitcoinAddress:{type: String, required: false},
	testnetBitcoinAddress:{type: String, required: false},
	testnetLitecoinAddress:{type: String, required: false},
	litecoinAddress:{type: String, required: false},

});

UserSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'index' });
module.exports = mongoose.model("users", UserSchema);