const { google } = require("googleapis");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
//
const credentials = require("../my_creds.json");
// Service account credentials provided in the console

// Load the service account credentials JSON file
// const credentials = require("../esther-file-upload-b32e5ead3358.json");

// Create a JWT client using the service account credentials

const jwtClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	["https://www.googleapis.com/auth/drive"],
);
// const jwtClient = new google.auth.JWT(
// 	process.env.CLIENT_EMAIL,
// 	null,
// 	process.env.PRIVATE_KEY,
// 	["https://www.googleapis.com/auth/drive"],
// );
// Create a new instance of the Google Drive API
const drive = google.drive({ version: "v3", auth: jwtClient });
// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("files", 10);

const uploadFile = () => async (req, res) => {
	upload(req, res, async (err) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		try {
			if (!req.files || req.files.length === 0) {
				return res.status(400).send("No files uploaded");
			}

			// Iterate over each file
			for (const file of req.files) {
				const fileMetadata = {
					name: file.originalname,
					parents: ["1YWDSDUgCCCCiPRwnebVQgRA1jexqyRjF"], // Specify the folder ID here
				};
				const tempFilePath = path.join(__dirname, "temp", file.originalname);
				fs.writeFileSync(tempFilePath, file.buffer);

				const media = {
					mimeType: file.mimetype,
					body: fs.createReadStream(tempFilePath), // Pass the file buffer directly
				};

				// Upload each file individually
				drive.files.create(
					{
						resource: fileMetadata,
						media: media,
						fields: "id",
					},
					(err, file) => {
						fs.unlinkSync(tempFilePath); // Delete temporary file
						if (err) {
							console.error("Error uploading file:", err);
							res.status(500).send("Error uploading file");
							return;
						}
						console.log("File uploaded, File ID:", file.data.id);
					},
				);
			}

			res.status(200).send("Files uploaded successfully");
		} catch (error) {
			console.error("Error handling file upload:", error);
			res.status(500).send("Error handling file upload");
		}
	});
};

module.exports = { uploadFile };
