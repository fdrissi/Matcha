const { pool } = require("../config/db");
const empty = require("is-empty");

async function SetImage(id, row) {
  let sql = "UPDATE photos SET row = ? WHERE id = ?";
  const [result] = await pool.query(sql, [row, id]);
  console.log(result);
  if (!empty(result)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  SetImage
};
