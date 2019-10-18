const { pool } = require("../config/db");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");

async function login(email) {
  email = escapeSpecialChars(email);
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  const [rows, fields] = await pool.query(sql);
  return rows[0];
}

async function findById(id) {
  let sql = `SELECT * FROM users WHERE id='${id}'`;
  const [rows, fields] = await pool.query(sql);
  return rows[0];
}

module.exports = {
  login,
  findById
};
