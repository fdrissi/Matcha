const { pool } = require("../config/db");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");

async function login(email, password) {
  email = escapeSpecialChars(email);
  password = escapeSpecialChars(password);
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  const [rows, fields] = await pool.query(sql);
  return rows[0];
}

module.exports = {
  login
};
