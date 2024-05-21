const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const { uploadFile } = require("../controllers/userController");

router.post("/upload", upload.single("file"), uploadFile());

module.exports = router;
