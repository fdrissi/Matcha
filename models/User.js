const { pool } = require("../config/db");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const empty = require("is-empty");
const { sendActivation } = require("../helpers/emailSender");

async function login(email) {
  email = escapeSpecialChars(email);
  const res = (await findByEmail(email))
    ? await findByEmail(email)
    : await findByUsername(email);
  return res;
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
    console.log(result);
    if (result.affectedRows) {
      sendActivation(data.email, data.userName, token);
      return result.affectedRows;
    }
  } catch (e) {
    console.log(e);
  }
}

async function findByEmail(email) {
  let sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.query(sql, email);
  return rows[0];
}

async function findByUsername(name) {
  let sql = "SELECT * FROM users WHERE username = ?";
  const [rows] = await pool.query(sql, [name]);
  return rows[0];
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

async function findUserByRecovery(token) {
  let sql = "SELECT * FROM users WHERE recovery_key = ?";
  const [result] = await pool.query(sql, [token]);
  if (!empty(result)) {
    return result[0];
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

async function findByToken(token) {
  let sql = "SELECT * FROM users WHERE recovery_key = ?";
  const [result] = await pool.query(sql, [token]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}
// set verification to true
async function updateValidation(userName, token) {
  let sql =
    "UPDATE users SET verified = ?, verification_key = ?  WHERE username = ? AND  verification_key = ?";
  const [result] = await pool.query(sql, [1, "", userName, token]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function updateFirstName(firstName, id) {
  let sql = "UPDATE users SET first_name = ? WHERE id = ?";
  const [result] = await pool.query(sql, [firstName, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function updateLastName(lastName, id) {
  let sql = "UPDATE users SET last_name = ? WHERE id = ?";
  const [result] = await pool.query(sql, [lastName, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function updateUsername(username, id) {
  let sql = "UPDATE users SET username = ? WHERE id = ?";
  const [result] = await pool.query(sql, [username, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function updateEmail(email, id) {
  let sql = "UPDATE users SET email = ? WHERE id = ?";
  const [result] = await pool.query(sql, [email, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function updatePassword(password, id) {
  let sql = "UPDATE users SET password = ? WHERE id = ?";
  const [result] = await pool.query(sql, [password, id]);
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
  setRecovery,
  updateFirstName,
  updateLastName,
  updateUsername,
  updateEmail,
  updatePassword,
  findByToken,
  findUserByRecovery
};
