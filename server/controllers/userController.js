const { google } = require("googleapis");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const Files = require("../model/File");

// const key = require("./julik.json");
// const key = require("./ruthk.json");
// const key = require("./estherw.json");

const auth = new google.auth.JWT(
	process.env.CLIENT_EMAIL,
	null,
	process.env.PRIVATE_KEY,
	["https://www.googleapis.com/auth/drive"],
);

// const auth = new google.auth.JWT(key.client_email, null, key.private_key, [
// 	"https://www.googleapis.com/auth/drive",
// ]);

const drive = google.drive({
	version: "v3",
	auth,
});
const folderId = process.env.FOLDER_ID;
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("files", 10);

const getFiles = () => async (req, res) => {
	// const folderIdentifier = "sharing files";
	// const folderIdentifier = "test17";
	// const folderIdentifier = "Wes & Es Wedding Pictures";

	const tempFolderPath = path.join(__dirname, "temp");
	try {
		const resources = await Files.find();

		res.status(200).json(resources);

		// const files = [];

		// async function retrieveFiles(pageToken) {
		// 	const params = {
		// 		q: `'${folderId}' in parents`,
		// 		fields: "nextPageToken, files(id, name, webViewLink)",
		// 		pageSize: 1000,
		// 	};
		// 	if (pageToken) {
		// 		params.pageToken = pageToken;
		// 	}

		// 	const driveRes = await drive.files.list(params);

		// 	// Update permissions to allow access to anyone with the link
		// 	driveRes.data.files.forEach((file) => {
		// 		const imageUrl = file.webViewLink;
		// 		const imageName = file.name;
		// 		const imageId = file.id;
		// 		files.push({ url: imageUrl, name: imageName, id: imageId });
		// 	});

		// 	if (driveRes.data.nextPageToken) {
		// 		await retrieveFiles(driveRes.data.nextPageToken);
		// 	}
		// }

		// await retrieveFiles();

		// res.status(200).send(files);
		// return files;

		// async function retrieveFolders(pageToken) {
		// 	const params = {
		// 		q: "mimeType='application/vnd.google-apps.folder'",
		// 		fields: "nextPageToken, files(id, name)",
		// 	};
		// 	if (pageToken) {
		// 		params.pageToken = pageToken;
		// 	}

		// 	const driveRes = await drive.files.list(params);

		// 	// Add the retrieved folders to the array
		// 	folders.push(...driveRes.data.files);

		// 	// If there are more folders, recursively retrieve them
		// 	if (driveRes.data.nextPageToken) {
		// 		await retrieveFolders(driveRes.data.nextPageToken);
		// 	}
		// }
		// await retrieveFolders();

		// async function deleteFolders(folderId) {
		// 	try {
		// 		await drive.files.delete({
		// 			fileId: folderId,
		// 		});
		// 		console.log("Folder deleted successfully.");
		// 	} catch (error) {
		// 		console.error("Error deleting folder:", error);
		// 		throw error;
		// 	}
		// }
		// const folderIdToDelete = "11x4KIxQRwPboYDvpoC_sJnD9_6FOTpII";
		// await deleteFolders(folderIdToDelete);

		// const folders = [];
		// console.log("Folders:", folders, folders.length);
		// if (folders.length === 0) {
		// 	async function createFolder(folderName) {
		// 		try {
		// 			const driveRes = await drive.files.create({
		// 				requestBody: {
		// 					name: folderName,
		// 					mimeType: "application/vnd.google-apps.folder",
		// 				},
		// 				fields: "id",
		// 			});
		// 			const folderId = driveRes.data.id;
		// 			const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
		// 			const emailAddresses = [
		// 				"astargw95@gmail.com",
		// 				"julikhosla17@gmail.com",
		// 				// "ruthkhosla17@gmail.com",
		// 			];
		// 			const permissionPromises = emailAddresses.map((email) => {
		// 				return drive.permissions.create({
		// 					fileId: folderId,
		// 					requestBody: {
		// 						role: "writer",
		// 						type: "user",
		// 						emailAddress: email,
		// 					},
		// 				});
		// 			});

		// 			await Promise.all(permissionPromises);

		// 			return folderUrl;
		// 			return driveRes.data.id;
		// 		} catch (error) {
		// 			console.error("Error creating folder:", error);
		// 			throw error;
		// 		}
		// 	}
		// 	const folderName = "asdfsad";
		// 	await createFolder(folderName);
		// 	console.log("Folder created successfully.");
		// } else {
		// 	console.log("Folder already exists. No action needed.");
		// }
		// return folders;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
};

const uploadFile = () => async (req, res) => {
	upload(req, res, async (err) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		try {
			if (!req.files || req.files.length === 0) {
				return res.status(400).send("No files uploaded");
			}

			for (const file of req.files) {
				const { mimetype, originalname } = file;

				const tempFilePath = path.join(__dirname, "temp", file.originalname);

				fs.writeFileSync(tempFilePath, file.buffer);
				const newResource = new Files({
					file: {
						contentType: mimetype,
						data: fs.readFileSync(tempFilePath),
						path: tempFilePath,
					},
					fileType: mimetype,
					originalname,
				});
				await newResource.save();

				const fileMetadata = {
					name: originalname,
					parents: [folderId],
				};

				const media = {
					mimeType: mimetype,
					body: fs.createReadStream(tempFilePath),
				};

				drive.files.create(
					{
						resource: fileMetadata,
						media,
						fields: "id",
					},
					(err, file) => {
						// fs.unlinkSync(tempFilePath);
						if (err) {
							console.error("Error uploading file:", err);
							res.status(500).send("Error uploading file");
							return;
						}
						console.log(file.data.id);
					},
				);
			}
			res.status(200).json("newResource");
		} catch (error) {
			console.error("Error handling file upload:", error);
			res.status(500).send("Error handling file upload");
		}
	});
};

module.exports = { uploadFile, getFiles };
