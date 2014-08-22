var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MicrolocationSchema = require('./microlocation');

var AddressSchema = new Schema({
	
	street: {type: String, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	zip: {type: Number, required: true},
	microlocations: [MicrolocationSchema.schema]
	
});

module.exports = mongoose.model('Address', AddressSchema);

