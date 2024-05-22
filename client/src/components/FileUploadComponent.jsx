// FileUploadComponent.js
import {
	Box,
	Button,
	Center,
	Progress,
	Text,
	useToast,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import ActivityService from "./ActivityService";

const FileUploadComponent = () => {
	// const [selectedFile, setSelectedFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const onDrop = useCallback((acceptedFiles) => {
		setUploadedFiles(acceptedFiles);
	}, []);
	// const handleFileChange = (e) => {
	// 	setSelectedFile(e.target.files[0]);
	// };
	const toast = useToast();
	const uploadFiles = async () => {
		if (!(uploadedFiles.length > 0)) {
			return;
		}
		setUploading(true);
		const interval = setInterval(() => {
			setUploadProgress((prevProgress) => {
				const newProgress = prevProgress + 10;
				if (newProgress === 100) {
					clearInterval(interval);
					toast({
						title: "Files uploaded successfully!",
						status: "success",
						duration: 2000,
						isClosable: true,
					});
					setUploading(false);
				}
				return newProgress;
			});
		}, 500);

		const formData = new FormData();
		uploadedFiles.forEach((file) => {
			formData.append("files", file);
		});
		try {
			const response = await ActivityService.upload(formData);
			console.log("Files uploaded:", response.data);
		} catch (error) {
			console.error("Error uploading files:", error);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	// const handleUpload = async () => {
	// 	// Simulate upload progress

	// 	const formData = new FormData();
	// 	formData.append("file", selectedFile);
	// 	try {
	// 		const response = await ActivityService.upload(formData);
	// 		console.log(response.data);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };
	return (
		<Center bg={"#caf0f8"} h={"100vh"} color={"#112A46"}>
			<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" bg="gray.50">
				<Text
					{...getRootProps()}
					style={{
						border: "2px dashed #ccc",
						padding: "20px",
						textAlign: "center",
					}}
				>
					<input {...getInputProps()} />
					<p>
						Drag 'n' drop some files here, or click to select files (maximum of
						10 files)
					</p>
				</Text>
				<Button
					mt={4}
					colorScheme="teal"
					onClick={uploadFiles}
					disabled={!uploadedFiles.length === 0 || uploading}
				>
					Upload
				</Button>

				{uploadedFiles.length > 0 && (
					<Text mt={2} fontSize="sm">
						Selected file(s):
						<ul>
							{uploadedFiles.map((file, index) => (
								<li key={index}>{file.name}</li>
							))}
						</ul>
					</Text>
				)}
				{uploading && <Progress mt={4} value={uploadProgress} />}
			</Box>
		</Center>
	);
};

export default FileUploadComponent;
