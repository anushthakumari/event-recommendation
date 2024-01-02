const mongoose = require("mongoose");

const EventTypes = require("./EventTypes");

const EventsSchema = new mongoose.Schema({
	title: {
		type: String,
	},

	event_date: Date,

	event_time: String,

	event_place:String,

	event_type_id: [
		{ type: mongoose.Schema.Types.ObjectId, ref: EventTypes.collection.name },
	],
});

const EventBookig = mongoose.model("events", EventsSchema);

module.exports = EventBookig;
