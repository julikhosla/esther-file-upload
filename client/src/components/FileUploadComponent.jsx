// FileUploadComponent.js
import {
	Box,
	Button,
	Center,
	HStack,
	Heading,
	Image,
	Progress,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import coverImg from "../assets/coverImg.jpeg";
import ActivityService from "./ActivityService";
import "./custom.css";

const FileUploadComponent = () => {
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const onDrop = useCallback((acceptedFiles) => {
		setUploadedFiles(acceptedFiles);
	}, []);
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
					setTimeout(() => {
						setUploadedFiles([]);
					}, 3000);
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

	return (
		<Box>
			<Image
				src={coverImg}
				alt="Cover Image"
				objectFit="cover"
				width="100%"
				height={{ base: "200px", md: "300px" }}
			/>
			<VStack
				backgroundColor="rgb(233 215 249 / 64%)"
				height={"calc(100vh - 300px)"}
			>
				<Center>
					<Heading
						p={{ base: "10px 5px", md: 8 }}
						className="great-vibes-regular"
						size={{ base: "xl", md: "3xl" }}
						mb={{ base: 2, md: 4 }}
						// color="white"
					>
						Welcome to our Photo Library
					</Heading>
				</Center>
				<HStack
					justifyContent={"space-between"}
					alignItems={"center"}
					flexDir={{ base: "column", md: "row" }}
				>
					<Box>
						<Center>
							<Text
								bg={"#352b3436"}
								{...getRootProps()}
								style={{
									border: "2px dashed #ccc",
									padding: "20px",
									textAlign: "center",
									borderRadius: "20px",
								}}
							>
								<input {...getInputProps()} />
								<Text
									p={{ base: 0, md: "1em 3em" }}
									// color={"white"}
									fontSize={{ base: "1em", md: "1.2em" }}
								>
									Drag 'n' drop some files here, or click to select files
									(maximum of 10 files)
								</Text>
							</Text>
						</Center>
						<Center>
							<Button
								mt={4}
								size={"lg"}
								colorScheme="purple"
								onClick={uploadFiles}
								disabled={!uploadedFiles.length === 0 || uploading}
							>
								Upload
							</Button>
						</Center>
						<Center mb={4} flexDir={"column"}>
							{uploading && (
								<Progress
									w={"50%"}
									margin={"0 auto"}
									mt={5}
									value={uploadProgress}
								/>
							)}
							{uploadedFiles.length > 0 && (
								<Text
									className="fancy-heading"
									mt={5}
									p={"5px 2em"}
									fontSize="sm"
									textAlign={"left"}
									// color={"white"}
								>
									Selected file(s):-
									<ul>
										{uploadedFiles.map((file, index) => (
											<li key={index}>{file.name}</li>
										))}
									</ul>
								</Text>
							)}
						</Center>
					</Box>
				</HStack>
			</VStack>
		</Box>
	);
};

export default FileUploadComponent;
