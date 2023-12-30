const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "event_types" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
