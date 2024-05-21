// ScanPage.js
import { Box, Center } from "@chakra-ui/react";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

const ScanPage = () => {
	const [result, setResult] = useState("");
	const navigate = useNavigate();

	const handleScan = (data) => {
		if (data) {
			setResult(data);
			navigate(`/upload/${data}`);
		}
	};

	const handleError = (err) => {
		console.error(err);
	};

	return (
		<Center h="100vh">
			<Box>
				<QrReader
					delay={300}
					onError={handleError}
					onScan={handleScan}
					style={{ width: "100%" }}
				/>
				<p>{result}</p>
			</Box>
		</Center>
	);
};

export default ScanPage;
