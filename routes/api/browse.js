const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/midlleware");
const browseModel = require("../../models/Browse");
const profileModel = require("../../models/Profile");
const moment = require("moment");
var _ = require("lodash");

//  Workibng on the browser
// @route   Post api/profle/getBrowser
// @desc    get Browser data
// @access  Private

router.get("/getBrowse/", [middleware.auth], async (req, res) => {
  const id = req.user.id;
  const interesting = await browseModel.getUserInfoByRow(
    id,
    "user_gender_interest"
  );
  const lat = await browseModel.getUserInfoByRow(id, "user_lat");
  const long = await browseModel.getUserInfoByRow(id, "user_lng");
  const gender = await browseModel.getUserInfoByRow(id, "user_gender");
  const data = await browseModel.getAllUserForBrowser(id, interesting, gender);
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
  data.map(value => {
    const destination = parseFloat(
      distance(lat, long, value.user_lat, value.user_lng).toFixed(2)
    );
    value.destination = destination;
    value.common_tags = _.intersection(
      JSON.parse(user_tags),
      JSON.parse(value.user_tags)
    ).length;
  });
  for (let element of data) {
    element.isLiked = await profileModel.isUserLikedProfile(id, element.id);
  }
  // const data = newData.filter(el => {
  //   return !(el.isLiked === true);
  // });
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

    const data = newData.filter(el => {
      const destination = parseFloat(
        distance(lat, long, el.user_lat, el.user_lng).toFixed(2)
      );

      if (el.fame_rate === 0) el.fame_rate = 1;
      return !(
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
  }
);

module.exports = router;
