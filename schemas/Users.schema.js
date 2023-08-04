const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// user.save((err) => {
// 	if (err) {
// 		console.error("Failed to save user:", err);
// 		return;
// 	}

// 	console.log("User saved successfully");
// });
