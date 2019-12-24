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
var _ = require("lodash");
const config = require("config");
const uploadPath = config.get("uploadPath");
const unlinkAsync = promisify(fs.unlink);
const { sendReport } = require("../../helpers/emailSender");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const { id } = req.user;
    const dir = `${uploadPath}/uploads/${id}/`;
    fs.exists(dir, exists => {
      if (!exists) {
        return fs.mkdir(dir, error => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function(req, file, callback) {
    const { row } = req.params;
    return callback(
      null,
      "IMAGE-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// @route   Post api/profle/upload
// @desc    upload user images
// @access  Private
const upload = multer({ storage: storage });
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
          let isEmpty = false;
          let filename = id + "/" + file.filename;
          const remove = await profileModel.removeOnUpload(id, row);
          const counter = await profileModel.getCounter(id);
          if (row === "profile_Image") {
            // for the profile image change
            check = await profileModel.setProfile(id, file.filename);
          } else if (remove !== "photo_holder.png" && row !== "profile_Image") {
            // in case he set a image on previouse image
            check = await profileModel.setImageRow(id, row, filename);
          } else {
            // here we gonna add image in case there is no image on it before
            check = await profileModel.SetImage(id, filename, counter);
          }
          const result = await profileModel.getImage(id);
          const cover = await profileModel.getImageByRow(id, "cover_Image");
          if (check) {
            if (remove !== "photo_holder.png") {
              await unlinkAsync(`${uploadPath}/uploads/${remove}`);
              if (remove === cover)
                await profileModel.setImageCover(id, "cover_holder.png");
            }
            if (remove === "photo_holder.png" && row !== "profile_Image")
              await profileModel.imagesCounter(id, "add");
            // her we gonna verified if the user set all the info on his profile
            const responde = await profileModel.getUserInfo(id);
            Object.keys(responde).forEach(key => {
              if (responde[key] === "") isEmpty = true;
            });
            if (
              _.isEmpty(JSON.parse(responde.user_tags)) ||
              responde.profile_Image === "photo_holder.png"
            )
              isEmpty = true;
            if (isEmpty) {
              await profileModel.setInfoVerified(false, id);
            } else {
              await profileModel.setInfoVerified(true, id);
            }
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
      const image = new Jimp(`${uploadPath}/uploads/${result}`, async function(
        err,
        image
      ) {
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
      });
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
        } else if (filed === "profile_Image") {
          await profileModel.setHolder(id);
          // her we gonna verified if the user set all the info on his profile
          const responde = await profileModel.getUserInfo(id);
          Object.keys(responde).forEach(key => {
            if (responde[key] === "") isEmpty = true;
          });
          if (
            _.isEmpty(JSON.parse(responde.user_tags)) ||
            responde.profile_Image === "photo_holder.png"
          )
            isEmpty = true;
          if (isEmpty) {
            await profileModel.setInfoVerified(false, id);
          } else {
            await profileModel.setInfoVerified(true, id);
          }
        } else {
          await profileModel.fixPosition(id, filed);
        }
        const result = await profileModel.getImage(id);
        if (result) {
          if (filed !== "profile_Image")
            profileModel.imagesCounter(id, "delete");
          await unlinkAsync(`${uploadPath}/uploads/${photo}`);
          await profileModel.setImageCover(id, "cover_holder.jpg");
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

// Profile_info

// @route   Post api/profle/getUserInfo
// @desc    get user info
// @access  Private
router.get("/getUserInfo/", [middleware.auth], async (req, res) => {
  try {
    let id =
      req.query.id && (await userModel.findById(+req.query.id))
        ? +req.query.id
        : req.user.id;
    id =
      (await profileModel.isUserBlockedProfile(+req.user.id, id)) ||
      (await profileModel.isUserBlockedProfile(id, +req.user.id))
        ? req.user.id
        : id;
    id !== req.user.id &&
      (await profileModel.setNotification(id, req.user.id, "visit"));
    const result = await profileModel.getUserInfo(+id);
    const liked = await profileModel.isUserLikedProfile(+req.user.id, +id);
    const blocked = await profileModel.isUserBlockedProfile(+req.user.id, id);
    const matched = await profileModel.areMatched(+req.user.id, +id);
    const loginTime = await profileModel.getLastLogin(+id);
    const [lastYear, LastMonth, lastDay, lastHour, lastMinute] = loginTime
      ? loginTime.split("-")
      : "";
    const last_login = loginTime
      ? moment(
          `[${lastYear}-${LastMonth}-${lastDay}-${lastHour}-${lastMinute}]`,
          ["YYYY-MM-DD-HH-mm"]
        ).fromNow()
      : null;
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
      user_online: result.online,
      user_location: {
        lat: parseFloat(result.user_lat, 10),
        lng: parseFloat(result.user_lng, 10)
      },
      user_last_login: last_login,
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
        },
        user_set_from_map: result.set_from_map
      };

      if (check) {
        // that mean that there is a change
        // her we gonna verified if the user set all the info on his profile
        let isEmpty = false;
        Object.keys(result).forEach(key => {
          if (result[key] === "") isEmpty = true;
        });
        if (
          _.isEmpty(JSON.parse(result.user_tags)) ||
          result.profile_Image === "photo_holder.png"
        )
          isEmpty = true;
        if (isEmpty) {
          await profileModel.setInfoVerified(false, id);
        } else {
          await profileModel.setInfoVerified(true, id);
        }
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
router.post(
  "/userLikeProfile",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
    const { profile } = req.body;
    const id = req.user.id;
    if (
      !profile ||
      !profile.id ||
      id === parseInt(profile.id) ||
      !(await profileModel.isProfileExists(profile.id))
    )
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
  }
);

// @route   Post api/profle/isUserLikeProfile
// @desc    is user already liked specific profile
// @access  Private
router.post(
  "/isUserLikedProfile",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
    const { profile } = req.body;
    const id = req.user.id;
    if (!profile || !profile.id || id === parseInt(profile.id))
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
  }
);

// @route   Get api/profle/areMatched
// @desc    are users matched
// @access  Private
router.get("/areMatched/:pid", [middleware.auth], async (req, res) => {
  const id = req.user.id;
  const pid = req.params.pid;
  try {
    //return true user and profile matched
    let result = await profileModel.areMatched(id, pid);
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
// @desc    Block or unblock profile
// @access  Private
router.post(
  "/userBlockProfile",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
    const { profile } = req.body;
    const id = req.user.id;
    if (
      !profile ||
      !profile.id ||
      id === parseInt(profile.id) ||
      !(await profileModel.isProfileExists(profile.id))
    )
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
  }
);

// @route   Post api/profle/isUserBlockedProfile
// @desc    is user already Blocked a specific profile
// @access  Private
router.post("/isUserBlockedProfile", [middleware.auth], async (req, res) => {
  const { profile } = req.body;
  const id = req.user.id;
  if (!profile || !profile.id || id === parseInt(profile.id))
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
router.post(
  "/reportProfile",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
    const { profile } = req.body;
    const id = req.user.id;
    if (
      !profile ||
      !profile.id ||
      id === parseInt(profile.id) ||
      !(await profileModel.isProfileExists(profile.id))
    )
      return res.json({
        success: false
      });
    try {
      //if profile not already reported, report it
      let result = await profileModel.reportProfile(id, profile.id);
      sendReport(profile.id, id);
      return res.json({
        success: result
      });
    } catch (error) {
      return res.json({
        success: false
      });
    }
  }
);

// @route   Post api/profle/recordVisitedProfiles
// @desc    Save each profile user visited
// @access  Private
router.post(
  "/recordVisitedProfiles",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
    const { profile } = req.body;
    const id = req.user.id;
    if (
      !profile ||
      !profile.id ||
      id === parseInt(profile.id) ||
      !(await profileModel.isProfileExists(profile.id))
    )
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
  }
);

// @route   Get api/profile/getUserHistory
// @desc    Get History
// @access  Private
router.get(
  "/getUserHistory",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
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
  }
);

// @route   Get api/profile/clearUserHistory
// @desc    Clear History
// @access  Private
router.get(
  "/clearUserHistory",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
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
  }
);

// @route   Get api/profile/getUserNotifications
// @desc    get User Notifications
// @access  Private
router.get(
  "/getUserNotifications",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
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
  }
);

// @route   Get api/profile/clearUserNotifications
// @desc    Clear user notifications
// @access  Private
router.get(
  "/clearUserNotifications",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
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
  }
);

// @route   Get api/profile/updateNotifications
// @desc    Update notifications, seen or not
// @access  Private
router.get(
  "/updateNotifications",
  [middleware.auth, middleware.infoVerified],
  async (req, res) => {
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
  }
);

// @route   Get api/profile/unseenNotificationsCount
// @desc    Get number of unseen notifications
// @access  Private
router.get("/unseenNotificationsCount", [middleware.auth], async (req, res) => {
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

// @route   Get api/profile/online
// @desc    Get number of online users
// @access  Public
router.get("/online", async (req, res) => {
  try {
    const result = await profileModel.getOnline();
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

router.get("/checkIsVerified", middleware.auth, async (req, res) => {
  const id = req.user.id;

  const responde = await profileModel.getUserInfo(id);
  let isEmpty = true;
  Object.keys(responde).forEach(key => {
    if (responde[key] === "") isEmpty = false;
  });
  if (
    _.isEmpty(JSON.parse(responde.user_tags)) ||
    responde.profile_Image === "photo_holder.png"
  )
    isEmpty = false;
  await profileModel.setInfoVerified(isEmpty, id);

  return res.json({
    success: true,
    isVerified: isEmpty
  });
});
router.get("/getSuggestions", middleware.auth, async (req, res) => {
  try {
    const tags_list = await profileModel.getAllTags();

    let tagsSuggestion = [];
    tags_list.forEach((item, index) => {
      if (item.user_tags)
        JSON.parse(item.user_tags).forEach((element, indexx) => {
          if (tagsSuggestion.indexOf(element) === -1)
            tagsSuggestion.push(element);
        });
    });
    return res.json({
      success: true,
      tagsSuggestion
    });
  } catch (error) {
    return res.json({
      success: false
    });
  }
});
module.exports = router;
