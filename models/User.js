const { pool } = require("../config/db");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const empty = require("is-empty");
const { sendActivation } = require("../helpers/user/emailSender");

async function login(email) {
  email = escapeSpecialChars(email);
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  try {
    const [rows] = await pool.query(sql);
    return rows[0];
  } catch (error) {
    return false;
  }
}

async function register(data) {
  try {
    data = escapeSpecialChars(data);
    const token = crypto.randomBytes(64).toString("hex");
    let hash = bcrypt.hashSync(data.password, 10);
    let sql =
      "INSERT INTO users (username, first_name, last_name, email, password, verification_key) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await pool.query(sql, [
      data.userName,
      data.firstName,
      data.lastName,
      data.email,
      hash,
      token
    ]);
    if (result.affectedRows) {
      sendActivation(data.email, data.userName, token);
      return result.affectedRows;
    }
  } catch (e) {
    console.log("Error caught");
  }
}
async function findByEmail(email) {
  let sql = "SELECT * FROM users WHERE email = ?";
  const [result] = await pool.query(sql, email);
  if (empty(result)) return false;
  else return result[0];
}

async function findByUsername(name) {
  let sql = "SELECT * FROM users WHERE username = ?";
  const [result] = await pool.query(sql, name);
  if (empty(result)) return false;
  else return result[0];
}

async function findById(id) {
  let sql = `SELECT * FROM users WHERE id='${id}'`;
  const [rows] = await pool.query(sql);
  return rows[0];
}

// check if the user alreay validate his account
async function checkActivation(userName) {
  let sql = "SELECT * FROM users WHERE username = ? OR email = ?";
  const [result] = await pool.query(sql, [userName, userName]);
  if (!empty(result)) {
    return result[0];
  } else {
    return false;
  }
}

// check if token is valide
async function ActivateUser(userName, token) {
  let sql =
    "SELECT verified from users WHERE username = ? AND verification_key = ?";
  const [result] = await pool.query(sql, [userName, token]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

// update the recovery token
async function setRecovery(email, token) {
  let sql = "UPDATE users SET recovery_key = ? WHERE email = ?";
  const [result] = await pool.query(sql, [token, email]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

// check if the user did active his account or not
async function checkByEamilUsernameValidation(value) {
  let sql = "select verified from users Where username = ? OR email = ?";
  const [result] = await pool.query(sql, [value, value]);
  if (!empty(result)) {
    return result[0].verified;
  } else {
    return false;
  }
}
// set verification to true
async function updateValidation(userName, token) {
  let sql =
    "UPDATE users SET verified = ?, verification_key = ?  WHERE username = ? AND  verification_key = ?";
  const [result] = await pool.query(sql, [1, 0, userName, token]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  login,
  findById,
  register,
  findByEmail,
  findByUsername,
  checkActivation,
  ActivateUser,
  updateValidation,
  checkByEamilUsernameValidation,
  setRecovery
};
