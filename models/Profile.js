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
    "SELECT * , DATE_FORMAT(user_birth, '%Y-%m-%d') as user_birth FROM user_info WHERE id = ?";
  const [result] = await pool.query(sql, [id]);
  return result[0];
}

async function updateUserInfo(data, id) {
  const {
    user_gender,
    user_tags,
    user_relationship,
    user_gender_interest
  } = data;
  const stringObj = JSON.stringify(user_tags);
  console.log(stringObj);

  let sql =
    "update user_info SET user_gender = ? , user_tags = ?,user_relationship = ? ,user_gender_interest = ? WHERE id = ?";
  const [result] = await pool.query(sql, [
    user_gender,
    stringObj,
    user_relationship,
    user_gender_interest,
    id
  ]);
  if (result.changedRows) {
    return true;
  } else {
    return false;
  }
}

async function getUserLikeProfileRow(userId, profileId) {
  try {
    let sql =
      "SELECT * FROM user_likes WHERE id_user_one = ? AND id_user_two = ?";
    let result = await pool.query(sql, [userId, profileId]);
    if (result[0].length > 0) return [result[0][0].id, true];
    sql = "SELECT * FROM user_likes WHERE id_user_one = ? AND id_user_two = ?";
    result = await pool.query(sql, [profileId, userId]);
    if (result[0].length > 0) return [result[0][0].id, false];
    return false;
  } catch (error) {
    return false;
  }
}

async function isUserLikeProfile(data) {
  let sql;
  if (data && data[1]) {
    sql = "SELECT * FROM user_likes WHERE user1_liked_user2 = ? AND id = ?";
  } else if (data && !data[1]) {
    sql = "SELECT * FROM user_likes WHERE user2_liked_user1 = ? AND id = ?";
  } else return userLikeProfile(data, userId, profileId);
  let [result] = await pool.query(sql, [true, data[0]]);
  return result[0] ? true : false;
}

async function userLikeProfileById(userId, profileId) {
  const data = await getUserLikeProfileRow(userId, profileId);
  let sql;
  if (data && data[1]) {
    sql = "UPDATE user_likes SET user1_liked_user2 = ? where id = ?";
  } else if (data && !data[1]) {
    sql = "UPDATE user_likes SET user2_liked_user1 = ? where id = ?";
  } else return userLikeProfile(data, userId, profileId);
  let [result] = await pool.query(sql, [true, data[0]]);
  await checkMatch(data[0]);
  return result;
}

async function userLikeProfile(userId, profileId) {
  let sql =
    "INSERT INTO user_likes (`id_user_one`, `id_user_two`, `user1_liked_user2`, `user2_liked_user1`) VALUES(?, ?, ?, ?)";
  const [result] = await pool.query(sql, [userId, profileId, true, false]);
  return result;
}

async function userUnlikeProfile(data) {
  let sql;
  if (data && data[1]) {
    sql =
      "UPDATE user_likes SET user1_liked_user2 = ?, matched = ? WHERE id = ? AND user1_liked_user2 = ?";
  } else if (data && !data[1]) {
    sql =
      "UPDATE user_likes SET user2_liked_user1 = ?, matched = ? WHERE id = ? AND user2_liked_user1 = ?";
  } else return false;
  let [result] = await pool.query(sql, [false, false, data[0], true]);
  return result.changedRows;
}

async function checkMatch(rowId) {
  let sql = "SELECT * FROM user_likes WHERE id = ?";
  let [result] = await pool.query(sql, [rowId]);
  if (result[0].user1_liked_user2 && result[0].user2_liked_user1) {
    sql = "UPDATE user_likes SET matched = ?";
    [result] = await pool.query(sql, [true]);
  }
}

async function areMatched(rowId) {
  let sql = "SELECT * FROM user_likes WHERE id = ?";
  let [result] = await pool.query(sql, [rowId]);
  return result[0].matched;
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
  getUserLikeProfileRow,
  userLikeProfile,
  userLikeProfileById,
  userUnlikeProfile,
  areMatched,
  isUserLikeProfile
};
