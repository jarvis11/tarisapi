var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MicrolocationSchema = require('./microlocation');

var AddressSchema = new Schema({
	street: String,
	city: String,
	state: String,
	zip: Number,
	//microlocations: [{type: Schema.Types.ObjectId, ref: 'Microlocation'}]
	microlocations: [MicrolocationSchema.Schema]
});

module.exports = mongoose.model('Address', AddressSchema);

