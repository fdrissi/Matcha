const { pool } = require("../config/db");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    let payload = {
      username: data.userName,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: hash,
      verification_key: token
    };
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
    return result.affectedRows;
  } catch (e) {
    console.log("Error caught");
  }
}

async function findById(id) {
  let sql = `SELECT * FROM users WHERE id='${id}'`;
  const [rows, fields] = await pool.query(sql);
  return rows[0];
}

module.exports = {
  login,
  findById,
  register
};
