const { pool } = require("../config/db");

// get user info by row
async function getUserInfoByRow(id, row) {
  let sql = `SELECT ${row} FROM user_info WHERE id = ?`;
  const [result] = await pool.query(sql, [id, id]);
  return result[0][row];
}

// all user info
async function getAllUserForBrowser(id, interesting, gender) {
  console.log(id, interesting, gender);
  let sql;
  switch (interesting) {
    case "Bisexual":
      sql = `SELECT t2.first_name, t2.last_name, t3.fame_rate, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id INNER JOIN user_fame_rate t3 ON t1.id = t3.id WHERE t1.id != ? AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR t1.id != '${id}' AND t2.verified = 1 AND  t1.user_gender_interest = "Bisexual"`;
      break;
    case "Male":
      sql = `SELECT t2.first_name, t2.last_name,t3.fame_rate, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id INNER JOIN user_fame_rate t3 ON t1.id = t3.id WHERE t1.id != ? AND t1.user_gender = "Male" AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR (t1.id != '${id}' AND t1.user_gender = "Male" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
    default:
      sql = `SELECT t2.first_name, t2.last_name, t3.fame_rate, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id INNER JOIN user_fame_rate t3 ON t1.id = t3.id WHERE (t1.id != ? AND t1.user_gender = 'Female' AND t1.user_gender_interest = '${gender}' AND t2.verified = 1) OR (t1.id != '${id}' AND t1.user_gender = "Female" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
  }
  const [result] = await pool.query(sql, [id]);
  return result;
}

//get browser users for by filter
async function getFilterUserForBrowser(id, interesting, gender) {
  console.log(id, interesting, gender);
  let sql;
  switch (interesting) {
    case "Bisexual":
      sql = `SELECT t2.first_name, t2.last_name, t3.fame_rate, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id INNER JOIN user_fame_rate t3 ON t1.id = t3.id WHERE t1.id != ? AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR t1.id != '${id}' AND t2.verified = 1 AND  t1.user_gender_interest = "Bisexual"`;
      break;
    case "Male":
      sql = `SELECT t2.first_name, t2.last_name,t3.fame_rate,  t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id INNER JOIN user_fame_rate t3 ON t1.id = t3.id  WHERE t1.id != ? AND t1.user_gender = "Male" AND t2.verified = 1 AND t1.user_gender_interest = '${gender}' OR (t1.id != '${id}' AND t1.user_gender = "Male" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
    default:
      sql = `SELECT t2.first_name, t2.last_name , t3.fame_rate, t1.* ,DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t1.user_birth, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(t1.user_birth, '00-%m-%d'))  as user_birth FROM user_info t1 INNER JOIN users t2 ON t1.id = t2.id   INNER JOIN user_fame_rate t3 ON t1.id = t3.id WHERE (t1.id != ? AND t1.user_gender = 'Female' AND t1.user_gender_interest = '${gender}' AND t2.verified = 1) OR (t1.id != '${id}' AND t1.user_gender = "Female" AND t1.user_gender_interest = "Bisexual" AND t2.verified = 1)`;
      break;
  }
  const [result] = await pool.query(sql, [id]);
  return result;
}
module.exports = {
  getUserInfoByRow,
  getAllUserForBrowser,
  getFilterUserForBrowser
};
