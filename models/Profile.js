const { pool } = require("../config/db");
const empty = require("is-empty");
const publicIp = require("public-ip");
const iplocation = require("iplocation").default;

async function SetImage(id, photoname, counter) {
  try {
    let sql;
    switch (counter) {
      case 0:
        sql = `UPDATE photos SET first_Image = ?  WHERE id = ?`;
        break;
      case 1:
        sql = `UPDATE photos SET second_Image = ?  WHERE id = ?`;
        break;
      case 2:
        sql = `UPDATE photos SET third_Image = ?  WHERE id = ?`;
        break;
      case 3:
        sql = `UPDATE photos SET fourth_Image = ?  WHERE id = ?`;
        break;
    }
    const [result] = await pool.query(sql, [photoname, id]);
    if (!empty(result)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function setProfile(id, photoname) {
  try {
    let filename = id + "/" + photoname;
    let sql = "UPDATE photos SET profile_Image = ? WHERE id = ?";
    const [result] = await pool.query(sql, [filename, id]);
    if (!empty(result)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function setHolder(id) {
  try {
    const Image_holder = "photo_holder.png";
    let sql = `UPDATE photos SET profile_Image = ? WHERE id = ?`;
    const [result] = await pool.query(sql, [Image_holder, id]);
    if (!empty(result)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function getImage(id) {
  try {
    let sql = `SELECT * FROM photos WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    if (!empty(result)) {
      return result[0];
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function imagesCounter(id, action) {
  try {
    let sql;
    if (action === "add")
      sql = `UPDATE photos SET counter = counter + 1 WHERE id = ?`;
    else sql = `UPDATE photos SET counter = counter - 1 WHERE id = ?`;
    await pool.query(sql, [id]);
  } catch (error) {
    return false;
  }
}

async function removeOnUpload(id, row) {
  try {
    let sql = `SELECT ${row} FROM photos WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    if (!empty(result)) {
      return result[0][row];
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function getCounter(id) {
  try {
    let sql = `SELECT counter FROM photos WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result[0].counter;
  } catch (error) {
    return false;
  }
}

async function setImageRow(id, row, filename) {
  try {
    let sql = `UPDATE photos SET ${row} = ? WHERE id = ?`;
    const [result] = await pool.query(sql, [filename, id]);
    if (!empty(result)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function setImageCover(id, filename) {
  try {
    let sql = `UPDATE photos SET cover_Image = ? WHERE id = ?`;
    const [result] = await pool.query(sql, [filename, id]);
    if (!empty(result)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function getImageByRow(id, row) {
  try {
    let sql = `SELECT ${row} FROM photos WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    if (!empty(result)) {
      return result[0][row];
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function fixPosition(id, row) {
  try {
    const Image_holder = "photo_holder.png";
    let counter;
    let sql;
    switch (row) {
      case "first_Image":
        counter = 0;
        break;
      case "second_Image":
        counter = 1;
        break;
      case "third_Image":
        counter = 2;
        break;
      default:
        counter = 3;
    }
    while (counter < 4) {
      switch (counter) {
        case 0:
          sql =
            "UPDATE photos SET first_Image = second_Image, second_Image = ? WHERE id = ?";
          break;
        case 1:
          sql =
            "UPDATE photos SET second_Image = third_Image, third_Image = ? WHERE id = ?";
          break;
        case 2:
          sql =
            "UPDATE photos SET third_Image = fourth_Image, fourth_Image = ? WHERE id = ?";
          break;
        case 3:
          sql = "UPDATE photos SET fourth_Image = ? WHERE id = ?";
      }
      const [result] = await pool.query(sql, [Image_holder, id]);
      counter++;
    }
    return true;
  } catch (error) {
    return false;
  }
}

// user info
async function getUserInfo(id) {
  try {
    let sql =
      "SELECT t2.first_name, t2.last_name, t3.profile_Image, t1.* , DATE_FORMAT(t1.user_birth, '%Y-%m-%d') as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id INNER JOIN photos t3 ON t1.id = t3.id WHERE t1.id = ?";
    const [result] = await pool.query(sql, [id]);
    return result[0];
  } catch (error) {
    return false;
  }
}

async function updateUserInfo(data, id) {
  try {
    const {
      user_gender,
      user_gender_interest,
      user_relationship,
      user_tags,
      user_birth_day,
      user_birth_year,
      user_birth_month,
      user_current_occupancy,
      user_city,
      user_biography,
      user_location
    } = data;
    const ipAddress = await publicIp.v4();
    let responde = await iplocation(ipAddress);
    let set_from_map =
      user_location.lat === responde.latitude &&
      user_location.lng === responde.longitude
        ? false
        : true;
    const tags = JSON.stringify(user_tags);
    if (user_birth_day && user_birth_month && user_birth_day)
      user_bith = `${user_birth_year}-${user_birth_month}-${user_birth_day}`;
    else user_bith = null;
    let result;
    if (!set_from_map) {
      let sql =
        "update user_info SET user_gender = ?  ,user_gender_interest = ? ,user_relationship = ? , user_tags = ? , user_birth = ?, user_city = ?, user_current_occupancy = ?, user_biography = ? , set_from_map = ?   WHERE id = ?";
      [result] = await pool.query(sql, [
        user_gender,
        user_gender_interest,
        user_relationship,
        tags,
        user_bith,
        user_city,
        user_current_occupancy,
        user_biography,
        set_from_map,
        id
      ]);
    } else if (set_from_map && user_location.lat && user_location.lng) {
      let sql =
        "update user_info SET user_gender = ?  ,user_gender_interest = ? ,user_relationship = ? , user_tags = ? , user_birth = ?, user_city = ?, user_lat = ?, user_lng = ? , user_current_occupancy = ?, user_biography = ? , set_from_map = ?   WHERE id = ?";
      [result] = await pool.query(sql, [
        user_gender,
        user_gender_interest,
        user_relationship,
        tags,
        user_bith,
        user_city,
        user_location.lat,
        user_location.lng,
        user_current_occupancy,
        user_biography,
        set_from_map,
        id
      ]);
    } else {
      let sql =
        "update user_info SET user_gender = ?  ,user_gender_interest = ? ,user_relationship = ? , user_tags = ? , user_birth = ?, user_city = ? , user_current_occupancy = ?, user_biography = ? WHERE id = ?";
      [result] = await pool.query(sql, [
        user_gender,
        user_gender_interest,
        user_relationship,
        tags,
        user_bith,
        user_city,
        user_current_occupancy,
        user_biography,
        id
      ]);
    }
    if (result.changedRows >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// update info_verified
async function setInfoVerified(value, id) {
  try {
    let sql = "UPDATE user_info SET info_verified = ? WHERE id = ?";
    await pool.query(sql, [value, id]);
    return true;
  } catch (error) {
    return false;
  }
}

async function isInfoVerified(id) {
  try {
    let sql = "SELECT info_verified FROM user_info WHERE id = ?";
    const [result] = await pool.query(sql, [id]);
    return !!result[0].info_verified;
  } catch (error) {
    return false;
  }
}

async function getResultByRow(row, id) {
  try {
    let sql = `SELECT ${row} from user_info WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result[0][row];
  } catch (error) {
    return false;
  }
}

async function updateGeoLocation(latitude, longitude, id) {
  try {
    let sql = "UPDATE user_info SET user_lat = ?, user_lng = ? WHERE id = ?";
    await pool.query(sql, [latitude, longitude, id]);
    return true;
  } catch (error) {
    return false;
  }
}

async function likeProfile(userId, profileId) {
  const blocked = await isUserBlockedProfile(userId, profileId);
  if (blocked) return false;
  try {
    const sql =
      "INSERT INTO `user_likes` (`id_user`, `id_profile`) VALUES(?, ?)";
    const [result] = await pool.query(sql, [userId, profileId]);
    const matched = await match(userId, profileId);
    if (!matched) await setNotification(profileId, userId, "like");
    await fameRate(profileId, "like");
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function unlikeProfile(userId, profileId) {
  try {
    const sql =
      "DELETE FROM `user_likes` WHERE `id_user` = ? AND `id_profile` = ?";
    const [result] = await pool.query(sql, [userId, profileId]);
    if (!!result.affectedRows) {
      await unmatch(userId, profileId);
      await fameRate(profileId, "unlike");
      await setNotification(profileId, userId, "unlike");
    }
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function isUserLikedProfile(userId, profileId) {
  try {
    const sql =
      "SELECT * FROM `user_likes` WHERE `id_user` = ? AND `id_profile` = ?";
    const [result] = await pool.query(sql, [userId, profileId]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function match(userId, profileId) {
  try {
    if (
      (await isUserLikedProfile(userId, profileId)) &&
      (await isUserLikedProfile(profileId, userId)) &&
      !(await areMatched(userId, profileId))
    ) {
      const sql =
        "INSERT INTO `user_match` (`id_user`, `id_profile`) VALUES(?, ?)";
      const [result] = await pool.query(sql, [userId, profileId]);
      await setNotification(profileId, userId, "likeBack");
      return !!result.affectedRows;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function unmatch(userId, profileId) {
  try {
    if (
      !(await isUserLikedProfile(userId, profileId)) ||
      !(await isUserLikedProfile(profileId, userId))
    ) {
      const sql =
        "DELETE FROM `user_match` WHERE (`id_user` = ? AND `id_profile` = ?) OR (`id_user` = ? AND `id_profile` = ?)";
      const [result] = await pool.query(sql, [
        userId,
        profileId,
        profileId,
        userId
      ]);
      return result[0];
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function areMatched(userId, profileId) {
  try {
    const sql =
      "SELECT * FROM `user_match` WHERE `id_user` = ? AND `id_profile` = ? OR `id_user` = ? AND `id_profile` = ?";
    const [result] = await pool.query(sql, [
      userId,
      profileId,
      profileId,
      userId
    ]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function blockProfile(userId, profileId) {
  const liked = await isUserLikedProfile(userId, profileId);
  if (liked) await unlikeProfile(userId, profileId);
  try {
    const sql =
      "INSERT INTO `user_block` (`id_user`, `id_profile`) VALUES(?, ?)";
    const [result] = await pool.query(sql, [userId, profileId]);
    if (!!result.affectedRows) clearMessageNotifications(userId, profileId);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function clearMessageNotifications(userId, profileId) {
  const sql =
    "UPDATE `user_messages` SET `seen` = ? WHERE (`sender` = ? AND `receiver` = ?) OR (`sender` = ? AND `receiver` = ?)";
  try {
    const [result] = await pool.query(sql, [
      true,
      userId,
      profileId,
      profileId,
      userId
    ]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function unblockProfile(userId, profileId) {
  try {
    const sql =
      "DELETE FROM `user_block` WHERE `id_user` = ? AND `id_profile` = ?";
    const [result] = await pool.query(sql, [userId, profileId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function isOnOFUserBlockedBy(userId, profileId) {
  try {
    const sql =
      "SELECT * FROM `user_block` WHERE `id_user` = ? AND `id_profile` = ? OR `id_user` = ? AND `id_profile` = ? ";
    const [result] = await pool.query(sql, [
      userId,
      profileId,
      profileId,
      userId
    ]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function isUserBlockedProfile(userId, profileId) {
  try {
    const sql =
      "SELECT * FROM `user_block` WHERE `id_user` = ? AND `id_profile` = ?";
    const [result] = await pool.query(sql, [userId, profileId]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function reportProfile(userId, profileId) {
  try {
    if (await isUserReportedProfile(userId, profileId)) return false;
    const sql =
      "INSERT INTO `user_reports` (`id_user`, `id_profile`) VALUES(?, ?)";
    const [result] = await pool.query(sql, [userId, profileId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function isUserReportedProfile(userId, profileId) {
  try {
    const sql =
      "SELECT * FROM `user_reports` WHERE `id_user` = ? AND `id_profile` = ?";
    const [result] = await pool.query(sql, [userId, profileId]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function isProfileExists(profileId) {
  try {
    const sql = "SELECT * FROM `user_info` WHERE `id` = ?";
    const [result] = await pool.query(sql, [profileId]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function fameRate(userId, type) {
  try {
    let sql;
    switch (type) {
      case "like":
        sql =
          "UPDATE `user_fame_rate` SET liked = liked + 1, fame_rate = 100 - (unliked * 100) / liked WHERE id = ?";
        break;
      case "unlike":
        sql =
          "UPDATE `user_fame_rate` SET unliked = unliked + 1, fame_rate = 100 - (unliked * 100) / liked WHERE id = ?";
        break;

      default:
        break;
    }

    const [result] = await pool.query(sql, [userId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function getFameRate(userId) {
  try {
    const sql = "SELECT * FROM `user_fame_rate` WHERE id = ?";
    const [result] = await pool.query(sql, [userId]);
    const fame = (result[0].unliked * 100) / result[0].liked;
    return 100 - fame;
  } catch (error) {
    return 0;
  }
}

async function recordVisitedProfiles(userId, profileId) {
  try {
    if (await isAlreadyVisited(userId, profileId)) return false;
    const sql =
      "INSERT INTO `user_history` (`id_user`, `id_profile`) VALUES(?, ?)";
    const [result] = await pool.query(sql, [userId, profileId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function isAlreadyVisited(userId, profileId) {
  try {
    const sql =
      "SELECT * FROM `user_history` WHERE `id_user` = ? AND `id_profile` = ? ";
    const [result] = await pool.query(sql, [userId, profileId]);
    return result.length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function clearHistory(userId) {
  try {
    const sql = "DELETE FROM `user_history` WHERE `id_user` = ?";
    const [result] = await pool.query(sql, [userId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function getHistory(userId) {
  try {
    const sql =
      "SELECT photos.profile_image, users.first_name, users.last_name, user_history.*, DATE_FORMAT(user_history.visit_date, '%Y-%m-%d') as date FROM `user_history` INNER JOIN users ON users.id = user_history.id_profile INNER JOIN photos ON photos.id = user_history.id_profile WHERE `id_user` = ? ORDER BY date DESC";
    const [result] = await pool.query(sql, [userId]);
    return result;
  } catch (error) {
    return false;
  }
}

async function setNotification(userId, profileId, type) {
  if (
    (await isUserBlockedProfile(userId, profileId)) ||
    (await isUserBlockedProfile(profileId, userId))
  )
    return false;
  try {
    const sql =
      "INSERT INTO user_notifications (`id_user`, `id_profile`, `notification`) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [userId, profileId, type]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function getUserNotifications(userId) {
  try {
    const sql =
      "SELECT photos.profile_image, users.first_name, users.last_name, user_notifications.*, DATE_FORMAT(user_notifications.date_notification, '%Y-%m-%d %H:%i') as date FROM user_notifications INNER JOIN users ON users.id = user_notifications.id_profile INNER JOIN photos ON photos.id = user_notifications.id_profile WHERE `id_user` = ? ORDER BY date DESC";
    const [result] = await pool.query(sql, [userId]);
    return result;
  } catch (error) {
    return false;
  }
}

async function clearUserNotifications(userId) {
  try {
    const sql = "DELETE FROM `user_notifications` WHERE `id_user` = ?";
    const [result] = await pool.query(sql, [userId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function updateNotifications(userId) {
  try {
    const sql =
      "UPDATE `user_notifications` SET `seen` = ? WHERE `id_user` = ?";
    const [result] = await pool.query(sql, [true, userId]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
}

async function getUnseenNotificationsCount(userId) {
  try {
    const sql =
      "SELECT count(*) as count FROM `user_notifications` WHERE `id_user` = ? AND `seen` = ?";
    const [result] = await pool.query(sql, [userId, false]);
    return result[0].count;
  } catch (error) {
    return false;
  }
}

async function getOnline() {
  try {
    const sql = "SELECT count(*) as count FROM `user_info` WHERE `online` = ? ";
    const [result] = await pool.query(sql, [true]);
    return result[0].count;
  } catch (error) {
    return false;
  }
}

module.exports = {
  SetImage,
  getImage,
  imagesCounter,
  removeOnUpload,
  getCounter,
  setHolder,
  setProfile,
  fixPosition,
  setImageRow,
  getImageByRow,
  setImageCover,
  getUserInfo,
  updateUserInfo,
  setInfoVerified,
  isInfoVerified,
  getResultByRow,
  updateGeoLocation,
  likeProfile,
  unlikeProfile,
  isUserLikedProfile,
  areMatched,
  blockProfile,
  unblockProfile,
  isUserBlockedProfile,
  reportProfile,
  isProfileExists,
  getFameRate,
  recordVisitedProfiles,
  getHistory,
  clearHistory,
  setNotification,
  getUserNotifications,
  clearUserNotifications,
  updateNotifications,
  getUnseenNotificationsCount,
  isOnOFUserBlockedBy,
  getOnline
};
