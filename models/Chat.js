const { pool } = require("../config/db");

const getUserAllMatches = async userId => {
  try {
    const sql =
      "SELECT\
      user_match.*,\
      users.first_name,\
      users.last_name,\
      photos.profile_Image\
  FROM\
      user_match\
  INNER JOIN users ON IF(\
          user_match.id_user != ?,\
          users.id = user_match.id_user,\
          users.id = user_match.id_profile\
      )\
  INNER JOIN photos ON IF(\
          user_match.id_user != ?,\
          photos.id = user_match.id_user,\
          photos.id = user_match.id_profile\
      )\
  WHERE\
      id_user = ? OR id_profile = ?";
    const [result] = await pool.query(sql, [userId, userId, userId, userId]);
    return result;
  } catch (error) {
    return false;
  }
};

const getUserConversations = async (uid, pid) => {
  try {
    const sql =
      "SELECT * FROM `user_messages` WHERE sender = ? AND receiver = ? OR sender = ? AND receiver = ?";
    const [result] = await pool.query(sql, [uid, pid, pid, uid]);
    return result;
  } catch (error) {
    return false;
  }
};

const sendMessage = async (sender, receiver, message) => {
  try {
    const sql =
      "INSERT INTO `user_messages` (`sender`, `receiver`, `message`)  Values (?, ?, ?)";
    const [result] = await pool.query(sql, [sender, receiver, message]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
};

const deleteConversation = async (uid, pid) => {
  try {
    const sql =
      "DELETE FROM `user_messages` WHERE sender = ? AND receiver = ? OR sender = ? AND receiver = ?";
    const [result] = await pool.query(sql, [uid, pid, pid, uid]);
    return !!result.affectedRows;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getUserAllMatches,
  getUserConversations,
  sendMessage,
  deleteConversation
};
