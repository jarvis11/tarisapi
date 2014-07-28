var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MicrolocationSchema = require('./microlocation');

var AddressSchema = new Schema({
	
	street: String,
	city: String,
	state: String,
	zip: Number,

	microlocations: [MicrolocationSchema.schema]
});

module.exports = mongoose.model('Address', AddressSchema);

