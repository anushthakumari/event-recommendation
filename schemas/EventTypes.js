const mongoose = require("mongoose");

const EventTypesSchema = new mongoose.Schema({
	title: {
		type: String,
		unique: true,
	},
});

const EventBookig = mongoose.model("event_types", EventTypesSchema);

module.exports = EventBookig;
