const { pool } = require("../config/db");
const empty = require("is-empty");

async function SetImage(id, row, photoname) {
  let sql = `UPDATE photos SET ${row} = ? WHERE id = ?`;
  const [result] = await pool.query(sql, [photoname, id]);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

async function getImage(id) {
  let sql = `SELECT * FROM photos WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  console.log(result);
  if (!empty(result)) {
    return result[0];
  } else {
    return false;
  }
}
module.exports = {
  SetImage
};
