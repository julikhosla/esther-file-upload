import { Heading, Image, VStack } from "@chakra-ui/react";
import React from "react";
import coverImg from "../assets/coverImg.jpeg";
import "./FileUpload.css";
import FileUploadComponent from "./FileUploadComponent";

const Content = () => {
	return (
		<VStack
			backgroundColor="rgb(233 215 249 / 64%)"
			height={"calc(100vh - 300px)"}
		>
			<Image
				src={coverImg}
				alt="Cover Image"
				objectFit="cover"
				width="100%"
				height={{ base: "200px", md: "300px" }}
			/>
			<Heading
				p={{ base: "10px 5px", md: 8 }}
				className="great-vibes-regular"
				size={{ base: "lg", md: "3xl" }}
				mb={{ base: 0, md: 4 }}
				// color="white"
			>
				Welcome to our Photo Library
			</Heading>

			<FileUploadComponent />
		</VStack>
	);
};

export default Content;
