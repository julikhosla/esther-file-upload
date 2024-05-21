// UploadPage.js
import React from "react";
import { useParams } from "react-router-dom";
import { Center, Heading } from "@chakra-ui/react";

const UploadPage = () => {
	const { qrData } = useParams();

	return (
		<Center h="100vh">
			<Heading>Upload Page for QR Data: {qrData}</Heading>
			{/* Implement your file upload logic here */}
		</Center>
	);
};

export default UploadPage;
