const mysql = require("mysql2");
const config = require("config");

const { user, password, host, database } = config.get("database");

const connection = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const pool = connection.promise();

// const connectDb = () => {
//   connection.connect(err => {
//     if (err) console.log(err);
//     else console.log("Database connected");
//   });
// };

module.exports = {
  pool
};
