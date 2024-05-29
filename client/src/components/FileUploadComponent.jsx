// FileUploadComponent.js
import {
	Box,
	Button,
	Center,
	Flex,
	HStack,
	Image,
	Progress,
	SimpleGrid,
	Text,
	useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ActivityService from "../service/ActivityService";
import "./FileUpload.css";

const FileUploadComponent = () => {
	const AnimatedHeading = motion.div;
	const toast = useToast();

	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [files, setFiles] = useState([]);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await ActivityService.getFiles();
				const updatedFiles = await Promise.all(
					response.data.map(async (file) => {
						const blob = new Blob([new Uint8Array(file.file.data.data)], {
							type: file.file.contentType,
						});
						const reader = new FileReader();
						reader.readAsDataURL(blob);
						return new Promise((resolve, reject) => {
							reader.onload = () => {
								file.imageUrl = reader.result;
								resolve(file);
							};
							reader.onerror = reject;
						});
					}),
				);

				setFiles(updatedFiles);
			} catch (error) {
				console.log(error);
			}
		};
		fetchFiles();
	}, [uploading]);

	const onDrop = useCallback((acceptedFiles) => {
		setUploadedFiles(acceptedFiles);
	}, []);

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
			await ActivityService.upload(formData);
		} catch (error) {
			console.error("Error uploading files:", error);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<HStack
			justifyContent={"space-between"}
			alignItems={"start"}
			w={"95%"}
			flexDir={{ base: "column", md: "row" }}
		>
			<Box>
				<Text
					{...getRootProps()}
					style={{
						border: "2px dashed #ccc",
						padding: "10px",
						textAlign: "center",
						borderRadius: "20px",
					}}
				>
					<input {...getInputProps()} />
					<Text
						p={{ base: 0, md: "1em 3em" }}
						// color={"white"}
						fontSize={{ base: "md", md: "1.2em" }}
						textDecor={"underline"}
					>
						<b>Tap here</b> to select files (maximum of 10 files)
					</Text>
				</Text>
				<HStack spacing={5} mt={4} justifyContent={"center"}>
					<Button
						colorScheme="purple"
						size={"sm"}
						onClick={getRootProps().onClick}
						isDisabled={uploadedFiles.length > 0}
					>
						Add files
					</Button>
					<Button
						colorScheme="purple"
						onClick={uploadFiles}
						size={"sm"}
						isLoading={uploading}
						isDisabled={uploadedFiles.length === 0}
					>
						Upload
					</Button>
				</HStack>
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
							mt={4}
							p={"5px"}
							fontSize="sm"
							textAlign={"center"}
							// color={"white"}
						>
							<Flex flexWrap="wrap" gap={"10px"}>
								{uploadedFiles.map((file) => (
									<HStack
										key={file.name}
										spacing={3}
										justifyContent={"space-between"}
										flexWrap={"wrap"}
									>
										{file.type.startsWith("image/") && (
											<img
												src={URL.createObjectURL(file)}
												alt={file.name}
												style={{ maxWidth: "80px", maxHeight: "80px" }}
											/>
										)}
									</HStack>
								))}
							</Flex>
						</Text>
					)}
				</Center>
			</Box>
			<Box>
				<Center>
					<AnimatedHeading
						as="h1"
						size={{ base: "lg", md: "xxl" }}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="great-vibes-regular sub_heading"
					>
						Image Gallery Scavenger Hunt
					</AnimatedHeading>
				</Center>
				<SimpleGrid columns={{ base: 3, lg: 6 }} spacing={3}>
					{!uploading &&
						files?.map(({ _id, originalname, imageUrl }) => (
							<React.Fragment key={_id}>
								{imageUrl && (
									<Image src={imageUrl} w={"100px"} alt={originalname} />
								)}
							</React.Fragment>
						))}
				</SimpleGrid>
			</Box>
		</HStack>
	);
};

export default FileUploadComponent;
