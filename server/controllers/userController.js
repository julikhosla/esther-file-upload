const { google } = require("googleapis");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const credentials = {
	type: "service_account",
	project_id: "esther-file-upload",
	private_key_id: "b32e5ead3358423a5076e88225ebd297dc75875e",
	private_key:
		"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoLucWo1BN3qH+\nstckJsUyRD/SAx3t8gtPC69rzAFx9p89LAsjfzvarU/39ZBopNIt5KlcrdHtddPF\ne16DClELB21QXPpvivpOs5ygdbXxZKS+quiYo18CX4jZitfwe5/0k6eeWLDvO0WE\nM5T3yQXFZTjz6wEDQFVQ4UGxTVtdCCcvzFe1J11cGHimOEQIzYIoqMnKtlQwqzey\nIovb4TMGrbVtnfs6jO2lijHaUfrI5wo0ALfJDLBfHPpsRNMD+QgKsg7o4BTUjmZs\nnPWQQHkWQpT7fVbuwms+FsAkkzhgA6RML0kBvvlgE8iYgzC6XpzO/z7mAhmUnOvN\nSTcXDoATAgMBAAECggEACJiLw+O3h9mSHXuibbJQeqm65RmadfNq48X81+gBVVkz\nKyCCi61pfel95AR0xKjhQr/H4HHwxx4Vv/zMD1X4e+AaItFs3AwPAdilfgB5ut1C\nRo2cPeMpgbN9UCpvdx3ycSSJR0QXwv3/0b/LK4gRHtVLb/SINnDUJ+zVNFPbrPes\n+7GU4HPEfeOnPlXCT+5JRzyh2NuTGthI33TYKNae88IORCdmxcPzuF2yOGPE1F31\nbev/afJ2emQmStqZXcWcbUSXBaG9QEUfiyfFAvSFNdQYiGcuc8c7xOtTD5Ht/fjw\nxNJWYFNK0Lnfi2KACYZuNPax9rgS8ArL9hpNaW+KbQKBgQDX7TagApDgwH9WUxV0\nmI+0K6h/UKqo2uhfFSIYm3StCt9Wro3z1gX6U6VRSgoajewQqtLMCmGHqwwOzoSh\n0MeFhHaax6qVY0EibnJ5iiRzsJwigEARGZ8k5d7sgJ1l8/AsoOSO2tptuWIL8H9X\nj2pxtk6LKIqK0oIxaQxVftLmpwKBgQDHZWAT23PQgy51JqsK42IykYOCYSQDmfJN\no2NVVnxPC9eoiZBUYCuvbKMXtjGK4qA/CcTN3KVTmTR+6V3J4pPeYbDCYvRKDJ1p\nz7EHkPUetLUQVR/M0oQ/jVt0s3RSDcvILFWruGV/GDL5pXoPn8qkcvQZXmopmTcT\n8inWTJy0tQKBgCKroRjCMLcV0ZxvzMMi9/gLBowizLQ+Kg+SWh4vX+WlGEVX080y\nMVWHdsT9qW+oGB54/03p4M0i5tW9zUgaON80bMLfioFgJYY8y76+Mqos0nUruJ3G\nSmpnSosY/6zuJUNVNj3F4Eq7+IVIQXoyufm2NxhbExvFP0hlwKg9q+mDAoGBAJ/p\n3bQPPELt8kRiTqrc0dRcf2wBHDEHNhyt/OxkAC4lAUBZkzcYKfD235YUuIb6Wio0\nW3H+k1kIdeGSp3VSEeU309sSIXmBxH0n5IJ87xlBNDV1D5vk+cs+QyrFAXUNO3G+\nnLarnDrh3X/6BnqhXJOm3b26ysmx50pH3OXRa5xBAoGBAKY5dqvUuizFHyUHpvTG\nm2STIbR895ffVDGVOec0ha/9oQOVvdFl6NEWekmCcO7yrBkXq76ogO5Q6R/32GSk\nxLhC8UcKMe9XOzd198i1+fQKUDpkXJ5G2LPgoTwUb5EPOoLWlrKywVchPrHwUNNi\nBFPkeDjw194nGgx5Wn2ByMKT\n-----END PRIVATE KEY-----\n",
	client_email: "esther-file-upload@esther-file-upload.iam.gserviceaccount.com",
	client_id: "115558915922975628995",
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url:
		"https://www.googleapis.com/robot/v1/metadata/x509/esther-file-upload%40esther-file-upload.iam.gserviceaccount.com",
	universe_domain: "googleapis.com",
};

// const credentials = require("../my_creds.json");
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
