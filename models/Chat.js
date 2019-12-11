const { pool } = require("../config/db");

const getUserAllMatches = async userId => {
  try {
    const sql =
      "SELECT * FROM `user_match`  INNER JOIN `users` IF(`users.id_user` != ?, On ) WHERE `id_user` = ? OR `id_profile` = ?";
    const [result] = await pool.query(sql, [userId]);
    return result;
  } catch (error) {}
};
