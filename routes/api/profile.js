const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth");
const photoModel = require("../../models/Photo");

const upload = multer({
  storage: multer.diskStorage({
    destination: "./client/public/uploads/",
    filename: function(req, file, cb) {
      cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 1000000 }
}).single("myImage");

router.post("/upload/:row", auth, async (req, res) => {
  const id = req.user.id;
  const { row } = req.params;
  await upload(async (req, res, err) => {
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.
    /*Now do where ever you want to do*/
    // if (!err) return res.send(200).end();
    if (!err) {
      // lets now work on our database
      const check = await photoModel.SetImage(id, row);
      if (check) console.log(check);
      else {
        console.log(check);
      }
    }
  });
});

module.exports = router;
