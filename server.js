const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const config = require("config");
const path = require("path");
const key = config.get("keyOrSecret");
const { pool } = require("./config/db");

const app = express();
app.use(cors());

// Set up express session middleware
app.use(cookieParser());

// Init Middleware
app.use(express.json({ extended: false }));

// This middleware adds the json header to every response
// app.use("*", (req, res, next) => {
//   res.setHeader("Content-Type", "application/json");
//   next();
// });

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/browse", require("./routes/api/browse"));
app.use("/api/chat", require("./routes/api/chat"));

// // Handle not valid route
// app.use("*", (req, res) => {
//   res.status(404).json({ status: false, message: "Endpoint Not Found" });
// });

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);
// Init socket io
const io = require("socket.io").listen(server, {
  pingInterval: 60000,
  pingTimeout: 60000
});
//Share it
let users = {};
io.use(function(socket, next) {
  if (socket.handshake.headers && socket.handshake.headers.cookie) {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    jwt.verify(cookies.token, key, function(err, decoded) {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", socket => {
  socket.on("login", async user => {
    if (user) {
      socket.userId = user;
      if (users[user] && users[user].indexOf(socket.id) === -1) {
        users[user].push(socket.id);
      } else users[user] = [socket.id];
      try {
        const sql = "UPDATE `user_info` SET online = ? WHERE id = ?";
        const [result] = await pool.query(sql, [true, user]);
        if (!!result.affectedRows) socket.emit("login", users);
      } catch (error) {}
      socket.emit("login", users);
    }
  });

  socket.on("notification", data => {
    if (users[data.id]) {
      users[data.id].map(rec => io.sockets.to(rec).emit("notification", data));
    }
  });

  socket.on("clearNotifications", data => {
    if (users[data.id]) {
      users[data.id].map(rec =>
        io.sockets.to(rec).emit("clearNotifications", data)
      );
    }
  });

  socket.on("newMessage", data => {
    if (users[data.receiver]) {
      users[data.receiver].map(rec =>
        io.sockets.to(rec).emit("newMessage", data)
      );
      users[data.receiver].map(rec =>
        io.sockets.to(rec).emit("notifMessage", data)
      );
    }
  });

  socket.on("seenUpdated", data => {
    if (users[data.id]) {
      io.sockets.to(users[data.id]).emit("notifMessage", data);
    }
  });

  socket.on("disconnect", async () => {
    if (users[socket.userId]) {
      if (users[socket.userId].length > 1) {
        users[socket.userId].splice(users[socket.userId].indexOf(socket.id), 1);
      } else {
        delete users[socket.userId];
        try {
          const sql = "UPDATE `user_info` SET online = ? WHERE id = ?";
          const [result] = await pool.query(sql, [false, socket.userId]);
        } catch (error) {}
      }
    }
  });
});
