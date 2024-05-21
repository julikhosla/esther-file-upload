const { google } = require("googleapis");

const fs = require("fs");
// Service account credentials provided in the console

// Load the service account credentials JSON file
const credentials = require("../esther-file-upload-b32e5ead3358.json");

// Create a JWT client using the service account credentials

const jwtClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	["https://www.googleapis.com/auth/drive"],
);

const drive = google.drive({ version: "v3", auth: jwtClient });
const uploadFile = () => async (req, res) => {
	console.log("hi");
	try {
		// Create an instance of the Drive API
		// Upload file to Google Drive
		console.log(req.file);
		if (!req.file) {
			return res.status(400).send("No file uploaded");
		}
		const fileMetadata = {
			name: req.file.originalname,
			parents: ["1YWDSDUgCCCCiPRwnebVQgRA1jexqyRjF"], // Specify the folder ID here
		};
		const media = {
			mimeType: req.file.mimetype,
		};

		drive.files.create(
			{
				resource: fileMetadata,
				media,
				fields: "id",
			},
			(err, file) => {
				if (err) {
					console.error("Error uploading file:", err);
					res.status(500).send("Error uploading file");
					return;
				}
				console.log("File uploaded, File ID:", file.data.id);
				res.status(200).send("File uploaded successfully");
			},
		);
	} catch (error) {
		console.error("Error handling file upload:", error);
		res.status(500).send("Error handling file upload");
	}
};

module.exports = { uploadFile };
