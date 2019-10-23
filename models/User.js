const { pool } = require("../config/db");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const empty = require("is-empty");
const { sendActivation } = require("../helpers/user/emailSender");

async function login(email) {
  email = escapeSpecialChars(email);
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  const [rows, fields] = await pool.query(sql);
  return rows[0];
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
      sendActivation(data.email, token);
      return result.affectedRows;
    }
  } catch (e) {
    console.log("Error caught");
  }
}
async function findByEmail(email) {
  let sql = "SELECT * FROM users WHERE email = ?";
  const [result] = await pool.query(sql, email);
  if (empty(result)) return true;
  else return false;
}

async function findByName(name) {
  let sql = "SELECT * FROM users WHERE username = ?";
  const [result] = await pool.query(sql, name);
  if (empty(result)) return true;
  else return false;
}

async function findById(id) {
  let sql = `SELECT * FROM users WHERE id='${id}'`;
  const [rows, fields] = await pool.query(sql);
  return rows[0];
}

module.exports = {
  login,
  findById,
  register,
  findByEmail,
  findByName
};
