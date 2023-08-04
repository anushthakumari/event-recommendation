const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const configs = require("../configs");

const uri = configs.MONGO_DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

module.exports = db;

db.on("connected", () => {
	console.log("Connected to the database");
});

db.on("error", (err) => {
	console.error("Failed to connect to the database:", err);
});

db.on("disconnected", () => {
	console.log("Disconnected from the database");
});
