const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth");
const photoModel = require("../../models/Profile");
const fs = require("file-system");
const { promisify } = require("util");
var Jimp = require("jimp");

const unlinkAsync = promisify(fs.unlink);

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
router.post(
  "/upload/:row",
  [auth, upload.single("myImage")],
  async (req, res) => {
    const file = req.file;
    const { row } = req.params;
    const id = req.user.id;
    const image = new Jimp(file.path, async function(err, image) {
      if (!err && file) {
        // var w = image.bitmap.width; //  width of the image
        // var h = image.bitmap.height; // height of the image
        // console.log(w);
        // console.log(h);
        let check;
        let filename = id + "/" + file.filename;
        const remove = await photoModel.removeOnUpload(id, row);
        const counter = await photoModel.getCounter(id);
        if (row === "profile_Image")
          check = await photoModel.setProfile(id, filename);
        else if (remove !== "photo_holder.png" && row !== "profile_Image")
          check = await photoModel.setImageRow(id, row, filename);
        else check = await photoModel.SetImage(id, filename, counter);
        const result = await photoModel.getImage(id);
        const cover = await photoModel.getImageByRow(id, "cover_Image");
        if (check) {
          if (remove !== "photo_holder.png" && remove !== `${id}/profile.png`) {
            await unlinkAsync(`./client/public/uploads/${remove}`);
            if (remove === cover)
              await photoModel.setImageCover(id, "cover_holder.png");
          }
          if (remove === "photo_holder.png" && row !== "profile_Image")
            await photoModel.imagesCounter(id, "add");
          return res.json({
            success: true,
            errorMsg: "Your image hass been uploaded 🤘",
            result
          });
        } else {
          return res.json({
            success: false,
            errorMsg: "There is an error on upload image api 😱"
          });
        }
      } else {
        await unlinkAsync(file.path);
        return res.json({
          success: false,
          errorMsg: "Please upload a Valide image 😠"
        });
      }
    });
  }
);

// @route   Post api/profle/getImage
// @desc    Get user images
// @access  Private
router.get("/getImage", [auth], async (req, res) => {
  const id = req.user.id;
  const result = await photoModel.getImage(id);
  if (result) {
    delete result.id;
    delete result.counter;
    // for (var k in result) payload[k] = result[k];
    return res.json({
      success: true,
      result
    });
  } else {
    console.log(error);
  }
});

// @route   Post api/profle/setCover
// @desc    Set user cover
// @access  Private
router.post("/setCover", [auth], async (req, res) => {
  try {
    const { filed } = req.body.data;
    const id = req.user.id;
    const result = await photoModel.getImageByRow(id, filed);
    console.log(result);
    if (result === "photo_holder.png") {
      return res.json({
        success: false,
        errorMsg: "You Cant Set The Holder As Cover 🤔"
      });
    } else {
      const image = new Jimp(
        `./client/public/uploads/${result}`,
        async function(err, image) {
          if (!err) {
            var w = image.bitmap.width; //  width of the image
            var h = image.bitmap.height; // height of the image
            console.log(w);
            console.log(h);
            if (w < 850 || h < 315) {
              return res.json({
                success: false,
                errorMsg:
                  "Your Cover Mut Be equal or mor than 850px width and 315 height 😮"
              });
            }
            const response = await photoModel.setImageCover(id, result);
            if (response) {
              return res.json({
                success: true,
                errorMsg: "Your Cover hass been Set 🤘"
              });
            } else {
              return res.json({
                success: false,
                errorMsg: "There is an error on uploading this cover 😱"
              });
            }
          } else {
            return res.json({
              success: false,
              errorMsg: "Error On Checking The Image 🤘"
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

// @route   Post api/profle/removeImage
// @desc    Remove user images
// @access  Private
router.delete("/removeImage", [auth], async (req, res) => {
  const { filed, photo } = req.body;
  const id = req.user.id;
  switch (photo) {
    case "photo_holder.png":
      return res.json({
        success: false,
        errorMsg: "You Can't Delete This image 😤"
      });
    default:
      const check = await photoModel.getImageByRow(id, filed);
      if (check !== photo) {
        const result = await photoModel.getImage(id);
        return res.json({
          success: false,
          errorMsg: "You Can't Delete This photo",
          result
        });
      } else if (filed === "profile_Image") await photoModel.setHolder(id);
      else {
        await photoModel.fixPosition(id, filed);
      }
      const result = await photoModel.getImage(id);
      if (result) {
        if (filed !== "profile_Image") photoModel.imagesCounter(id, "delete");
        await unlinkAsync(`./client/public/uploads/${photo}`);
        await photoModel.setImageCover(id, "cover_holder.png");
        return res.json({
          success: true,
          errorMsg: "Your image hass been Deleted 🗑️",
          result
        });
      } else {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong",
          result
        });
      }
  }
});

module.exports = router;
