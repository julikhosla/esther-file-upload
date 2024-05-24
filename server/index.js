require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");

const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use((request, response, next) => {
	console.log(request.path, request.method);
	next();
});
// allow users to uplaod files based on link click or based on qrcode scanner
app.use("/api", userRoutes);
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
	console.log("Connected to MongoDB");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
