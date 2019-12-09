const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const middleware = require("../../middleware/midlleware");
const profileModel = require("../../models/Profile");
const userModel = require("../../models/User");
const fs = require("file-system");
const { promisify } = require("util");
const Jimp = require("jimp");
const publicIp = require("public-ip");
const predefined = require("../globals");
const iplocation = require("iplocation").default;
const moment = require("moment");

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
    if (row === "profile_Image") return callback(null, "profile" + ".jpg");
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
    try {
      const file = req.file;
      const { row } = req.params;
      const id = req.user.id;
      const image = new Jimp(file.path, async function(err, image) {
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
            if (
              remove !== "photo_holder.png" &&
              remove !== `${id}/profile.png`
            ) {
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
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Error Occured"
      });
    }
  }
);

// @route   Post api/profle/getImage
// @desc    Get user images
// @access  Private
router.get("/getImage", [middleware.auth], async (req, res) => {
  try {
    const id =
      req.query.id && (await userModel.findById(req.query.id))
        ? req.query.id
        : req.user.id;
    const result = await profileModel.getImage(id);
    if (result) {
      delete result.id;
      delete result.counter;
      result.loading = false;
      // for (var k in result) payload[k] = result[k];
      return res.json({
        success: true,
        result
      });
    }
    return res.json({
      success: false
    });
  } catch (error) {
    return res.json({
      success: false
    });
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
    return res.json({
      success: false,
      errorMsg: "Error Occured"
    });
  }
});

// @route   Post api/profle/removeImage
// @desc    Remove user images
// @access  Private
router.delete("/removeImage", [middleware.auth], async (req, res) => {
  try {
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
          if (filed !== "profile_Image")
            profileModel.imagesCounter(id, "delete");
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
  } catch (error) {
    return res.json({
      success: false,
      errorMsg: "Error occured"
    });
  }
});

//  Workibng on the browser
// @route   Post api/profle/getBrowser
// @desc    get Browser data
// @access  Private
router.get("/getBrowser/", [middleware.auth], async (req, res) => {
  try {
    const id = req.user.id;
    const interesting = await profileModel.getUserInfoByRow(
      id,
      "user_gender_interest"
    );
    const lat = await profileModel.getUserInfoByRow(id, "user_lat");
    const long = await profileModel.getUserInfoByRow(id, "user_lng");
    const gender = await profileModel.getUserInfoByRow(id, "user_gender");
    const data = await profileModel.getAllUserForBrowser(
      id,
      interesting,
      gender
    );
    function distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295; // Math.PI / 180
      var c = Math.cos;
      var a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    data.map(value => {
      const destination = parseFloat(
        distance(lat, long, value.user_lat, value.user_lng).toFixed(2)
      );
      value.destination = destination;
    });
    data.sort((a, b) =>
      a.destination > b.destination ? 1 : b.destination > a.destination ? -1 : 0
    );
    return res.json(data);
  } catch (error) {
    return false;
  }
});

//  Workibng on the browser
// @route   Post api/profle/getFilter
// @desc    filter for the browser
// @access  Private
router.get(
  "/getFilter",
  [middleware.auth, middleware.browse_filter],
  async (req, res) => {
    const id = req.user.id;
    const { filter } = req.query;
    const { age_range, location_range, fame_rating } = JSON.parse(filter);
    const interesting = await profileModel.getUserInfoByRow(
      id,
      "user_gender_interest"
    );
    const lat = await profileModel.getUserInfoByRow(id, "user_lat");
    const long = await profileModel.getUserInfoByRow(id, "user_lng");
    const gender = await profileModel.getUserInfoByRow(id, "user_gender");
    const newData = await profileModel.getFilterUserForBrowser(
      id,
      interesting,
      gender,
      filter
    );

    function distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295; // Math.PI / 180
      var c = Math.cos;
      var a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    console.log(age_range);

    const data = newData.filter(el => {
      const destination = parseFloat(
        distance(lat, long, el.user_lat, el.user_lng).toFixed(2)
      );
      return !(
        destination > location_range ||
        el.user_birth < age_range[0] ||
        el.user_birth > age_range[1]
      );
    });
    data.forEach(el => {
      const destination = parseFloat(
        distance(lat, long, el.user_lat, el.user_lng).toFixed(2)
      );
      el.destination = destination;
    });
    data.sort((a, b) =>
      a.destination > b.destination ? 1 : b.destination > a.destination ? -1 : 0
    );
    return res.json({
      success: true,
      data
    });
  }
);

// Profile_info

// @route   Post api/profle/getInfo
// @desc    get user info
// @access  Private
router.get("/getUserInfo/", [middleware.auth], async (req, res) => {
  try {
    const id =
      req.query.id && (await userModel.findById(+req.query.id))
        ? +req.query.id
        : req.user.id;
    id !== req.user.id &&
      (await profileModel.setNotification(id, req.user.id, "visit"));
    const result = await profileModel.getUserInfo(+id);
    const liked = await profileModel.isUserLikedProfile(+req.user.id, +id);
    const blocked = await profileModel.isUserBlockedProfile(+req.user.id, id);
    const matched = await profileModel.areMatched(+req.user.id, +id);
    var obj = JSON.parse(result.user_tags);
    const [year, month, day] = result.user_birth
      ? result.user_birth.split("-")
      : "";

    const age = result.user_birth
      ? moment().diff(`${year}-${month}-${day}`, "years")
      : null;
    const fameRate = await profileModel.getFameRate(id);
    const my_info = {
      loading: false,
      liked,
      matched,
      blocked,
      id,
      user_first_name: result.first_name,
      user_last_name: result.last_name,
      user_gender: result.user_gender,
      user_relationship: result.user_relationship,
      user_birth_day: day,
      user_tags: obj ? obj : [],
      user_birth_month: month,
      user_current_occupancy: result.user_current_occupancy,
      user_gender_interest: result.user_gender_interest,
      user_birth_year: year,
      user_age: age,
      user_city: result.user_city,
      user_biography: result.user_biography,
      user_location: {
        lat: parseFloat(result.user_lat, 10),
        lng: parseFloat(result.user_lng, 10)
      },
      user_fame_rate: fameRate,
      user_set_from_map: result.set_from_map
    };
    let get_info = JSON.stringify(my_info, function(key, value) {
      return value === undefined ? "" : value;
    });
    let info = JSON.parse(get_info);
    return res.json({
      success: true,
      info
    });
  } catch (error) {
    return res.json({
      success: true
    });
  }
});

// @route   Post api/profle/updateSettingInfo
// @desc    update user info
// @access  Private
router.post(
  "/updateUserInfo",
  [middleware.auth, middleware.edit_profile],
  async (req, res) => {
    try {
      const { data } = req.body;
      const id = req.user.id;
      const check = await profileModel.updateUserInfo(data, id);
      const result = await profileModel.getUserInfo(id);
      const [year, month, day] = result.user_birth
        ? result.user_birth.split("-")
        : "";
      var obj = JSON.parse(result.user_tags);
      const my_info = {
        user_gender: result.user_gender,
        user_relationship: result.user_relationship,
        user_birth_day: day ? day : "",
        user_tags: obj ? obj : [],
        user_birth_month: month ? month : "01",
        user_current_occupancy: result.user_current_occupancy,
        user_gender_interest: result.user_gender_interest,
        user_birth_year: year ? year : "",
        user_city: result.user_city,
        user_biography: result.user_biography,
        user_location: {
          lat: parseFloat(result.user_lat, 10),
          lng: parseFloat(result.user_lng, 10)
        }
      };
      console.log(my_info);
      if (check) {
        // that mean that there is a change
        return res.json({
          success: true,
          errorMsg: "UPDATE SUCCESS 😎",
          my_info
        });
      } else {
        // mean taht there is no change
        return res.json({
          success: true,
          errorMsg: "Nothing To be Update 😏",
          my_info
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Error Occured"
      });
    }
  }
);

// @route   Get api/profle/setUserLocation
// @desc    set userLocation Value
// @access  private
router.post("/setUserLocation", [middleware.auth], async (req, res) => {
  try {
    const id = req.user.id;
    const { latitude, longitude, error } = req.body.data;
    const result = await profileModel.getResultByRow("set_from_map", id);
    if (error) {
      if (error && !result) {
        const ipAddress = await publicIp.v4();
        iplocation(ipAddress, [], async (error, resp) => {
          if (!error) {
            if (
              await profileModel.updateGeoLocation(
                resp.latitude,
                resp.longitude,
                id
              )
            )
              return res.status(200).send("user didn't accepte set location");
          } else {
            res.status(200).send("error in getting ip address");
          }
        });
      } else {
        return res.status(200).send("set_from_map TRUE");
      }
    } else {
      if (!result) {
        if (await profileModel.updateGeoLocation(latitude, longitude, id)) {
          return res.status(200).send("USER ACCEPTE");
        }
      } else {
        return res.status(200).send("set_from_map TRUE ");
      }
    }
  } catch (error) {
    return false;
  }
});

// @route   Get api/profle/getpreedefined
// @desc    get preedefined data
// @access  public
router.get("/getpreedefined", async (req, res) => {
  try {
    res.json({
      success: true,
      predefined
    });
  } catch (error) {
    res.json({
      success: false
    });
  }
});

// @route   Post api/profle/likeUser
// @desc    Like, unlike profile
// @access  Private
router.post("/userLikeProfile", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    //if user already liked this profile, unlike it, else like
    let result = await profileModel.isUserLikedProfile(+id, +profile.id);
    result = result
      ? await profileModel.unlikeProfile(+id, +profile.id)
      : await profileModel.likeProfile(+id, +profile.id);

    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/profle/isUserLikeProfile
// @desc    is user already liked specific profile
// @access  Private
router.post("/isUserLikedProfile", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    //return true if user already liked profile
    const result = await profileModel.isUserLikedProfile(+id, +profile.id);

    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/profle/areMatched
// @desc    is user already liked specific profile
// @access  Private
router.post("/areMatched", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    //return true if user already liked profile
    let result = await profileModel.areMatched(id, profile.id);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/profile/userBlockProfile
// @desc    is user already liked specific profile
// @access  Private
router.post("/userBlockProfile", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    //If user already blocked profile, ublock, else block it
    let result = await profileModel.isUserBlockedProfile(id, profile.id);
    result = result
      ? await profileModel.unblockProfile(id, profile.id)
      : await profileModel.blockProfile(id, profile.id);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/profle/isUserBlockedProfile
// @desc    is user already Blocked a specific profile
// @access  Private
router.post("/isUserBlockedProfile", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    //return true if user already blocked profile
    let result = await profileModel.isUserBlockedProfile(id, profile.id);

    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/profle/isUserBlockedProfile
// @desc    Report a specific profile
// @access  Private
router.post("/reportProfile", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    //if profile not already reported, report it
    let result = await profileModel.reportProfile(id, profile.id);

    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Post api/profle/recordVisitedProfiles
// @desc    Save each profile user visited
// @access  Private
router.post("/recordVisitedProfiles", middleware.auth, async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (id === parseInt(profile.id))
    return res.json({
      success: false
    });
  try {
    const result = await profileModel.recordVisitedProfiles(id, profile.id);
    await profileModel.getHistory(id);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/profile/getUserHistory
// @desc    Get History
// @access  Private
router.get("/getUserHistory", middleware.auth, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await profileModel.getHistory(id);
    return res.json({
      success: true,
      history: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/profile/clearUserHistory
// @desc    Clear History
// @access  Private
router.get("/clearUserHistory", middleware.auth, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await profileModel.clearHistory(id);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/profile/getUserNotifications
// @desc    get User Notifications
// @access  Private
router.get("/getUserNotifications", middleware.auth, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await profileModel.getUserNotifications(id);
    return res.json({
      success: true,
      notifications: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/profile/clearUserNotifications
// @desc    Clear user notifications
// @access  Private
router.get("/clearUserNotifications", middleware.auth, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await profileModel.clearUserNotifications(id);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/profile/updateNotifications
// @desc    Clear user notifications
// @access  Private
router.get("/updateNotifications", middleware.auth, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await profileModel.updateNotifications(id);
    return res.json({
      success: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

// @route   Get api/profile/unseenNotificationsCount
// @desc    Get number of unseen notifications
// @access  Private
router.get("/unseenNotificationsCount", middleware.auth, async (req, res) => {
  const id = req.user.id;
  try {
    const result = await profileModel.getUnseenNotificationsCount(id);
    return res.json({
      success: true,
      count: result
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});

module.exports = router;
