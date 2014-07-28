var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BidSchema = new Schema({
	
	type: String,
	amount: Number
});

module.exports = mongoose.model('Bid', BidSchema);