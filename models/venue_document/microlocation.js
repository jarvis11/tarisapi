var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MicrolocationSchema = new Schema({
	
	uuid: String,
	major_id: Number,
	minor_id: Number,
	descriptor_tag: [String],
	action_tag: [String],
	price_tag: [String]
});

module.exports = mongoose.model('Microlocation', MicrolocationSchema);