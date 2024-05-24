const express = require("express");
const router = express.Router();

const { uploadFile, getFiles } = require("../controllers/userController");

router.get("/files", getFiles());
router.post("/upload", uploadFile());

module.exports = router;
