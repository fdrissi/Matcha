const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// @route   GET api/profile
// @desc    Profile Route
// @access  Public
const storage = multer.diskStorage({
  destination: "/client/public/uploads/",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("image");

router.post("/upload", (req, res) => {
  upload(req, res, err => {
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.
    /*Now do where ever you want to do*/
    if (!err) return res.send(200).end();
  });
});

module.exports = router;
