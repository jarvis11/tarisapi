var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MicrolocationSchema = new Schema({
	
	uuid: {type: String, required: true},
	major_id: {type: Number, required: true},
	minor_id: {type: Number, required: true},
	descriptor_tag: [String],
	action_tag: [String],
	price_tag: String
});

module.exports = mongoose.model('Microlocation', MicrolocationSchema);