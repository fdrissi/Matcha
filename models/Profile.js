const { pool } = require("../config/db");
const empty = require("is-empty");

async function SetImage(id, photoname, counter) {
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
}

async function setProfile(id, photoname) {
  let sql = "UPDATE photos SET profile_Image = ? WHERE id = ?";
  const [result] = await pool.query(sql, [photoname, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function setHolder(id) {
  const Image_holder = "photo_holder.png";
  let sql = `UPDATE photos SET profile_Image = ? WHERE id = ?`;
  const [result] = await pool.query(sql, [Image_holder, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function getImage(id) {
  let sql = `SELECT * FROM photos WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  if (!empty(result)) {
    return result[0];
  } else {
    return false;
  }
}

async function imagesCounter(id, action) {
  let sql;
  if (action === "add")
    sql = `UPDATE photos SET counter = counter + 1 WHERE id = ?`;
  else sql = `UPDATE photos SET counter = counter - 1 WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
}

async function removeOnUpload(id, row) {
  let sql = `SELECT ${row} FROM photos WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  if (!empty(result)) {
    return result[0][row];
  } else {
    return false;
  }
}

async function getCounter(id) {
  let sql = `SELECT counter FROM photos WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  return result[0].counter;
}

async function setImageRow(id, row, filename) {
  let sql = `UPDATE photos SET ${row} = ? WHERE id = ?`;
  const [result] = await pool.query(sql, [filename, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function setImageCover(id, filename) {
  let sql = `UPDATE photos SET cover_Image = ? WHERE id = ?`;
  const [result] = await pool.query(sql, [filename, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function getImageByRow(id, row) {
  let sql = `SELECT ${row} FROM photos WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  if (!empty(result)) {
    return result[0][row];
  } else {
    return false;
  }
}

async function fixPosition(id, row) {
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
}

// user info

async function getUserInfo(id) {
  let sql =
    "SELECT t2.first_name, t2.last_name, t1.* , DATE_FORMAT(t1.user_birth, '%Y-%m-%d') as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE t1.id = ?";
  const [result] = await pool.query(sql, [id]);
  return result[0];
}

// all user info
async function getAllUserForBrowser(id, interesting, gender) {
  let sql;
  switch (interesting) {
    case "Bisexual":
      sql = `SELECT t2.first_name, t2.last_name, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE t1.id != ? AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR t1.id != '${id}' AND t2.verified = 1 AND  t1.user_gender_interest = "Bisexual"`;
      break;
    case "Male":
      sql = `SELECT t2.first_name, t2.last_name, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE t1.id != ? AND t1.user_gender = "Male" AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR (t1.id != '${id}' AND t1.user_gender = "Male" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
    default:
      sql = `SELECT t2.first_name, t2.last_name, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE (t1.id != ? AND t1.user_gender = 'Female' AND t1.user_gender_interest = '${gender}' AND t2.verified = 1) OR (t1.id != '${id}' AND t1.user_gender = "Female" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
  }
  const [result] = await pool.query(sql, [id]);
  return result;
}

//get browser users for by filter
async function getFilterUserForBrowser(id, interesting, gender) {
  let sql;
  switch (interesting) {
    case "Bisexual":
      sql = `SELECT t2.first_name, t2.last_name, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE t1.id != ? AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR t1.id != '${id}' AND t2.verified = 1 AND  t1.user_gender_interest = "Bisexual"`;
      break;
    case "Male":
      sql = `SELECT t2.first_name, t2.last_name, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE t1.id != ? AND t1.user_gender = "Male" AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR (t1.id != '${id}' AND t1.user_gender = "Male" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
    default:
      sql = `SELECT t2.first_name, t2.last_name, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id WHERE (t1.id != ? AND t1.user_gender = 'Female' AND t1.user_gender_interest = '${gender}' AND t2.verified = 1) OR (t1.id != '${id}' AND t1.user_gender = "Female" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
  }
  const [result] = await pool.query(sql, [id]);
  return result;
}

// get user info by row
async function getUserInfoByRow(id, row) {
  let sql = `SELECT ${row} FROM user_info WHERE id = ?`;
  const [result] = await pool.query(sql, [id, id]);
  return result[0][row];
}

async function updateUserInfo(data, id) {
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
  const set_from_map = user_location.lat && user_location.lng ? true : false;
  const tags = JSON.stringify(user_tags);
  if (user_birth_day && user_birth_month && user_birth_day)
    user_bith = `${user_birth_year}-${user_birth_month}-${user_birth_day}`;
  else user_bith = null;
  let sql =
    "update user_info SET user_gender = ?  ,user_gender_interest = ? ,user_relationship = ? , user_tags = ? , user_birth = ?, user_city = ?, user_lat = ?, user_lng = ? , user_current_occupancy = ?, user_biography = ? , set_from_map = ?   WHERE id = ?";
  const [result] = await pool.query(sql, [
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
  if (result.changedRows) {
    return true;
  } else {
    return false;
  }
}

async function isUserLikedProfile(userId, profileId) {
  try {
    let sql =
      "SELECT * FROM user_likes WHERE id_user_one = ? AND id_user_two = ? OR id_user_two = ? AND id_user_one = ?";
    let result = await pool.query(sql, [userId, profileId, userId, profileId]);
    return result[0].length > 0 ? true : false;
  } catch (error) {
    return false;
  }
}

async function likeStatus(userId, profileId) {
  try {
    let sql =
      "SELECT * FROM user_likes WHERE id_user_one = ? AND id_user_two = ? OR id_user_two = ? AND id_user_one = ?";
    let [result] = await pool.query(sql, [
      userId,
      profileId,
      userId,
      profileId
    ]);
    if (
      result[0].id_user_one === userId &&
      result[0].id_user_two === profileId
    ) {
      console.log("model1", !!result[0].user1_liked_user2);
      return !!result[0].user1_liked_user2;
    }
    console.log("model2", !!result[0].user2_liked_user1);
    return !!result[0].user2_liked_user1;
  } catch (error) {
    return false;
  }
}

async function likeUnlikeProfile(userId, profileId) {
  try {
    let sql =
      "UPDATE  user_likes\
    SET     user1_liked_user2 = IF(`id_user_one` = ? AND `id_user_two` = ?, NOT user1_liked_user2, user1_liked_user2),\
            user2_liked_user1 = IF(`id_user_one` = ? AND `id_user_two` = ?, NOT user2_liked_user1, user2_liked_user1)\
    WHERE   `id_user_one` = ? AND `id_user_two` = ? OR `id_user_one` = ? AND `id_user_two` = ?";
    let result = await pool.query(sql, [
      userId,
      profileId,
      profileId,
      userId,
      userId,
      profileId,
      profileId,
      userId
    ]);
    checkMatch(userId, profileId);
    return result ? true : false;
  } catch (error) {
    return false;
  }
}

async function userLikeProfile(userId, profileId) {
  let sql =
    "INSERT INTO user_likes (`id_user_one`, `id_user_two`, `user1_liked_user2`, `user2_liked_user1`) VALUES(?, ?, ?, ?)";
  const [result] = await pool.query(sql, [userId, profileId, true, false]);
  await checkMatch(userId, profileId);
  return result;
}

async function checkMatch(userId, profileId) {
  try {
    let sql =
      "SELECT * FROM user_likes WHERE `id_user_one` = ? AND `id_user_two` = ? OR `id_user_one` = ? AND `id_user_two` = ?";
    let [result] = await pool.query(sql, [
      userId,
      profileId,
      profileId,
      userId
    ]);

    if (result[0].user1_liked_user2 && result[0].user2_liked_user1) {
      sql = "UPDATE user_likes SET matched = ?";
      [result] = await pool.query(sql, [true]);
    } else {
      sql = "UPDATE user_likes SET matched = ?";
      [result] = await pool.query(sql, [false]);
    }
  } catch (error) {
    return false;
  }
}

async function areMatched(userId, profileId) {
  let sql =
    "SELECT * FROM user_likes WHERE `id_user_one` = ? AND `id_user_two` = ? OR `id_user_one` = ? AND `id_user_two` = ?";
  let [result] = await pool.query(sql, [userId, profileId, profileId, userId]);
  return result.length > 0 ? !!result[0].matched : false;
}

async function getResultByRow(row, id) {
  let sql = `SELECT ${row} from user_info WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  return result[0][row];
}

async function updateGeoLocation(latitude, longitude, id) {
  let sql = "UPDATE user_info SET user_lat = ?, user_lng = ? WHERE id = ?";
  await pool.query(sql, [latitude, longitude, id]);
  return true;
}

async function isUserBlockedProfile(userId, profileId) {
  let sql = "SELECT * FROM user_block WHERE id_user = ? AND id_profile = ?";
  const [result] = await pool.query(sql, [userId, profileId]);
  return result.length > 0 ? !!result[0].blocked : false;
}

async function getBlockedProfileRow(userId, profileId) {
  let sql = "SELECT * FROM user_block WHERE id_user = ? AND id_profile = ?";
  const [result] = await pool.query(sql, [userId, profileId]);
  return result[0] ? result[0].id : 0;
}

async function blockProfile(userId, profileId) {
  let sql =
    "INSERT INTO user_block (`id_user`, `id_profile`, `blocked`) VALUES (?, ?, ?)";
  const [result] = await pool.query(sql, [userId, profileId, true]);
  return result ? true : false;
}

async function blockProfileById(id, userId, profileId) {
  const blocked = await isUserBlockedProfile(userId, profileId);
  if (blocked) return await unblockProfile(id);
  let sql = "UPDATE user_block SET blocked = ? WHERE id = ?";
  const [result] = await pool.query(sql, [true, id]);
  return result ? true : false;
}

async function unblockProfile(id) {
  let sql = "UPDATE user_block SET blocked = ? WHERE id = ?";
  const [result] = await pool.query(sql, [false, id]);
  return result ? true : false;
}

async function reported(userId, profileId) {
  let sql = "SELECT * FROM user_reports WHERE id_user = ? AND id_profile = ?";
  const [result] = await pool.query(sql, [userId, profileId]);
  return result.length > 0 ? true : false;
}

async function reportProfile(userId, profileId) {
  if (await reported(userId, profileId)) return false;
  let sql =
    "INSERT INTO `user_reports` (`id_user`, `id_profile`) VALUES (?, ?)";
  const [result] = await pool.query(sql, [userId, profileId]);
  return result ? true : false;
}

async function setUserOnline(userId) {
  let sql = "UPDATE `user_info` SET `online` = ? WHERE id = ?";
  const [result] = await pool.query(sql, [true, userId]);
  return result ? true : false;
}

async function setUserOffline(userId) {
  let sql = "UPDATE `user_info` SET `online` = ? WHERE id = ?";
  const [result] = await pool.query(sql, [false, userId]);
  return result ? true : false;
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
  isUserLikedProfile,
  likeStatus,
  likeUnlikeProfile,
  userLikeProfile,
  areMatched,
  getResultByRow,
  updateGeoLocation,
  isUserBlockedProfile,
  getBlockedProfileRow,
  blockProfileById,
  blockProfile,
  unblockProfile,
  reportProfile,
  setUserOnline,
  setUserOffline,
  getAllUserForBrowser,
  getUserInfoByRow,
  getFilterUserForBrowser
};
