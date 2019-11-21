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
  updateUserInfo
};