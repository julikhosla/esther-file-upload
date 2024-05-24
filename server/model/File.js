const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
	file: {
		data: Buffer,
		contentType: String,
		path: String,
	},
	fileType: String,
	originalname: String,
	uploadedOn: { type: Date, default: Date.now },
});

const Files = mongoose.model("Files", fileSchema);

module.exports = Files;
