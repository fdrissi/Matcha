const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth");
const photoModel = require("../../models/Photo");
const fs = require("file-system");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const { id } = req.user;
    const { row } = req.params;
    const dir = `./client/public/uploads/${id}/`;
    fs.exists(dir, exists => {
      if (!exists) {
        return fs.mkdir(dir, error => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function(req, file, callback) {
    const { row } = req.params;
    console.log(row);
    if (row === "profile_Image")
      return callback(null, "profile" + path.extname(file.originalname));
    else
      return callback(
        null,
        "IMAGE-" + Date.now() + path.extname(file.originalname)
      );
  }
});

// @route   Post api/profle/upload
// @desc    upload user images
// @access  Private
var upload = multer({ storage: storage });
router.post("/upload/:row", [auth, upload.single("myImage")], (req, res) => {
  const file = req.file;
  const { row } = req.params;
  const id = req.user.id;
  console.log(file);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return error;
  } else {
    const check = photoModel.SetImage(id, row, file.filename);
    if (check) {
      return res.json({
        success: true,
        errorMsg: "Your image hass been uploaded"
      });
    } else {
      return res.json({
        success: false,
        errorMsg: "There an error on upload image api"
      });
    }
  }
});

module.exports = router;
