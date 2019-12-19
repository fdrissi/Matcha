const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/midlleware");
const browseModel = require("../../models/Browse");
const profileModel = require("../../models/Profile");
const moment = require("moment");
var _ = require("lodash");
var NodeGeocoder = require("node-geocoder");

var options = {
  provider: "google",

  // Optional depending on the providers
  httpAdapter: "https", // Default
  apiKey: "AIzaSyAKq30EizjABPHYvcIRWtlQ08yWtQFBNTg", // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

//  Workibng on the browser
// @route   Post api/profle/getBrowser
// @desc    get Browser data
// @access  Private

router.get("/getBrowse/", [middleware.auth], async (req, res) => {
  try {
    const id = req.user.id;
    const interesting = await browseModel.getUserInfoByRow(
      id,
      "user_gender_interest"
    );
    const lat = await browseModel.getUserInfoByRow(id, "user_lat");
    const long = await browseModel.getUserInfoByRow(id, "user_lng");
    const gender = await browseModel.getUserInfoByRow(id, "user_gender");
    const newData = await browseModel.getAllUserForBrowser(
      id,
      interesting,
      gender
    );
    const user_tags = await browseModel.getUserInfoByRow(id, "user_tags");
    const sort_by = "Location";
    function distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295; // Math.PI / 180
      var c = Math.cos;
      var a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    newData.map(value => {
      const destination = parseFloat(
        distance(lat, long, value.user_lat, value.user_lng).toFixed(2)
      );
      value.destination = destination;
      value.common_tags = _.intersection(
        JSON.parse(user_tags),
        JSON.parse(value.user_tags)
      ).length;
    });
    for (let element of newData) {
      element.isLiked = await profileModel.isUserLikedProfile(id, element.id);
      element.is_Blocked = await profileModel.isOnOFUserBlockedBy(
        id,
        element.id
      );
    }
    console.log("test");
    console.log(newData);
    const data = newData.filter(el => {
      return !(
        el.is_Blocked === true ||
        el.destination > 30 ||
        el.fame_rate < 20 ||
        el.common_tags < 1
      );
    });

    data.sort((a, b) =>
      // a.destination > b.destination ? 1 : b.destination > a.destination ? -1 : 0
      a.destination > b.destination
        ? 1
        : b.destination > a.destination
        ? -1
        : a.common_tags > b.common_tags
        ? -1
        : 1
    );
    return res.json({ data, sort_by });
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
    try {
      const id = req.user.id;
      const { filter } = req.query;
      const { age_range, location_range, fame_rating } = JSON.parse(filter);
      const interesting = await browseModel.getUserInfoByRow(
        id,
        "user_gender_interest"
      );
      const lat = await browseModel.getUserInfoByRow(id, "user_lat");
      const long = await browseModel.getUserInfoByRow(id, "user_lng");
      const user_tags = await browseModel.getUserInfoByRow(id, "user_tags");
      const gender = await browseModel.getUserInfoByRow(id, "user_gender");
      const newData = await browseModel.getFilterUserForBrowser(
        id,
        interesting,
        gender,
        filter
      );
      const sort_by = "Location";

      function distance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a =
          0.5 -
          c((lat2 - lat1) * p) / 2 +
          (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      }

      for (let element of newData) {
        element.is_Blocked = await profileModel.isOnOFUserBlockedBy(
          id,
          element.id
        );
      }
      const data = newData.filter(el => {
        const destination = parseFloat(
          distance(lat, long, el.user_lat, el.user_lng).toFixed(2)
        );

        if (el.fame_rate === 0) el.fame_rate = 1;
        return !(
          el.is_Blocked === true ||
          destination > location_range ||
          !(
            el.fame_rate <= fame_rating * 20 &&
            el.fame_rate > fame_rating * 20 - 20
          ) ||
          el.user_birth < age_range[0] ||
          el.user_birth > age_range[1]
        );
      });
      data.forEach(el => {
        const destination = parseFloat(
          distance(lat, long, el.user_lat, el.user_lng).toFixed(2)
        );
        el.destination = destination;
        el.common_tags = _.intersection(
          JSON.parse(user_tags),
          JSON.parse(el.user_tags)
        ).length;
      });
      data.sort((a, b) =>
        a.destination > b.destination
          ? 1
          : b.destination > a.destination
          ? -1
          : a.common_tags > b.common_tags
          ? -1
          : 1
      );
      return res.json({
        success: true,
        data,
        sort_by
      });
    } catch (error) {
      return false;
    }
  }
);

//  Workibng on the browser
// @route   Post api/profle/getFilter
// @desc    filter for the browser
// @access  Private
router.get(
  "/getSearch",
  [middleware.auth, middleware.search_filter],
  async (req, res) => {
    try {
      const id = req.user.id;
      const { filter } = req.query;
      const { age_range, tags, location, fame_rating } = JSON.parse(filter);
      const sort_by = "Location";
      const gender = await browseModel.getUserInfoByRow(id, "user_gender");
      const user_tags = await browseModel.getUserInfoByRow(id, "user_tags");
      const interesting = await browseModel.getUserInfoByRow(
        id,
        "user_gender_interest"
      );
      const newData = await browseModel.getUserForSearch(
        id,
        interesting,
        gender
      );
      geocoder.geocode(location, async function(err, responde) {
        if (!err) {
          const { latitude, longitude } = responde[0];
          function distance(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295; // Math.PI / 180
            var c = Math.cos;
            var a =
              0.5 -
              c((lat2 - lat1) * p) / 2 +
              (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
          }
          for (let element of newData) {
            element.is_Blocked = await profileModel.isOnOFUserBlockedBy(
              id,
              element.id
            );
          }
          const data = newData.filter(el => {
            const destination = parseFloat(
              distance(latitude, longitude, el.user_lat, el.user_lng).toFixed(2)
            );
            if (el.fame_rate === 0) el.fame_rate = 1;
            return !(
              destination > 100 ||
              el.is_Blocked === true ||
              !(
                el.fame_rate <= fame_rating * 20 &&
                el.fame_rate > fame_rating * 20 - 20
              ) ||
              _.intersection(JSON.parse(user_tags), JSON.parse(el.user_tags))
                .length < tags ||
              el.user_birth < age_range[0] ||
              el.user_birth > age_range[1]
            );
          });
          data.forEach(el => {
            const destination = parseFloat(
              distance(latitude, longitude, el.user_lat, el.user_lng).toFixed(2)
            );
            el.destination = destination;
            el.common_tags = _.intersection(
              JSON.parse(user_tags),
              JSON.parse(el.user_tags)
            ).length;
          });
          data.sort((a, b) =>
            a.destination > b.destination
              ? 1
              : b.destination > a.destination
              ? -1
              : a.common_tags > b.common_tags
              ? -1
              : 1
          );
          return res.json({
            success: true,
            data,
            sort_by
          });
        } else {
          return res.json({
            success: false,
            errorMsg: "Unsuccessful Search 🤕"
          });
        }
      });
    } catch (error) {
      return false;
    }
  }
);

module.exports = router;
