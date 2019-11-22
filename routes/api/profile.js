const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const middleware = require("../../middleware/midlleware");
const profileModel = require("../../models/Profile");
const fs = require("file-system");
const { promisify } = require("util");
var Jimp = require("jimp");
const publicIp = require("public-ip");
const cities = require("../globals");

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
  [middleware.auth, upload.single("myImage")],
  async (req, res) => {
    const file = req.file;
    const { row } = req.params;
    const id = req.user.id;
    const image = new Jimp(file.path, async function(err, image) {
      console.log(await publicIp.v4());
      if (!err && file) {
        let filename = id + "/" + file.filename;
        const remove = await profileModel.removeOnUpload(id, row);
        const counter = await profileModel.getCounter(id);
        if (row === "profile_Image")
          check = await profileModel.setProfile(id, filename);
        else if (remove !== "photo_holder.png" && row !== "profile_Image")
          check = await profileModel.setImageRow(id, row, filename);
        else check = await profileModel.SetImage(id, filename, counter);
        const result = await profileModel.getImage(id);
        const cover = await profileModel.getImageByRow(id, "cover_Image");
        if (check) {
          if (remove !== "photo_holder.png" && remove !== `${id}/profile.png`) {
            await unlinkAsync(`./client/public/uploads/${remove}`);
            if (remove === cover)
              await profileModel.setImageCover(id, "cover_holder.png");
          }
          if (remove === "photo_holder.png" && row !== "profile_Image")
            await profileModel.imagesCounter(id, "add");
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
router.get("/getImage", [middleware.auth], async (req, res) => {
  const id = req.user.id;
  const result = await profileModel.getImage(id);
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
router.post("/setCover", [middleware.auth], async (req, res) => {
  try {
    const { filed } = req.body.data;
    const id = req.user.id;
    const result = await profileModel.getImageByRow(id, filed);
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
            const response = await profileModel.setImageCover(id, result);
            if (response) {
              const result = await profileModel.getImage(id);
              return res.json({
                success: true,
                errorMsg: "Your Cover hass been Set 🤘",
                result
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
router.delete("/removeImage", [middleware.auth], async (req, res) => {
  const { filed, photo } = req.body;
  const id = req.user.id;
  switch (photo) {
    case "photo_holder.png":
      return res.json({
        success: false,
        errorMsg: "You Can't Delete This image 😤"
      });
    default:
      const check = await profileModel.getImageByRow(id, filed);
      if (check !== photo) {
        const result = await profileModel.getImage(id);
        return res.json({
          success: false,
          errorMsg: "You Can't Delete This photo",
          result
        });
      } else if (filed === "profile_Image") await profileModel.setHolder(id);
      else {
        await profileModel.fixPosition(id, filed);
      }
      const result = await profileModel.getImage(id);
      if (result) {
        if (filed !== "profile_Image") profileModel.imagesCounter(id, "delete");
        await unlinkAsync(`./client/public/uploads/${photo}`);
        await profileModel.setImageCover(id, "cover_holder.png");
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

// Profile_info

// @route   Post api/profle/getInfo
// @desc    get user info
// @access  Private
router.get("/getUserInfo/:id?", [middleware.auth], async (req, res) => {
  const id =  (req.params.id) ? req.params.id : req.user.id;
  const result = await profileModel.getUserInfo(id);
  var obj = JSON.parse(result.user_tags);
  const [year, month, day] = result.user_birth
    ? result.user_birth.split("-")
    : "";
  const info = {
    user_gender: result.user_gender,
    user_relationship: result.user_relationship,
    user_birth_day: day,
    user_tags: obj ? obj : [],
    user_birth_month: month,
    user_current_occupancy: result.user_current_occupancy,
    user_gender_interest: result.user_gender_interest,
    user_birth_year: year,
    user_city: "",
    user_biography: "",
    user_location: {
      lat: 32.879101,
      lng: -6.91118
    }
  };
  return res.json({
    success: true,
    info
  });
});

// @route   Post api/profle/updateUserInfo
// @desc    update user info
// @access  Private

router.post("/updateUserInfo", [middleware.auth], async (req, res) => {
  try {
    const { data } = req.body;
    const id = req.user.id;
    console.log(data);
    const result = await profileModel.updateUserInfo(data, id);
    if (result) {
      // that mean that there is a change
    } else {
      // mean taht there is no change
      return res.json({
        success: false,
        errorMsg: "Nothing To be Update"
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// @route   Get api/profle/getpreedefined
// @desc    get preedefined data
// @access  public

router.get("/getpreedefined", async (req, res) => {
  try {
    res.json({
      success: true,
      cities
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
