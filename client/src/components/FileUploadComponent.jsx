// FileUploadComponent.js
import React, { useState } from "react";
import ActivityService from "./ActivityService";

const FileUploadComponent = () => {
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("file", file);
		try {
			const response = await ActivityService.upload(formData);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload}>Upload</button>
		</div>
	);
};

export default FileUploadComponent;
