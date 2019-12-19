const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const config = require("config");
const key = config.get("keyOrSecret");

const app = express();
app.use(cors());

// Set up express session middleware
app.use(cookieParser());

// Init Middleware
app.use(express.json({ extended: false }));

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/browse", require("./routes/api/browse"));
app.use("/api/chat", require("./routes/api/chat"));

// Handle not valid route
app.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log("Backend server Started.."));
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
  console.log("new connection", socket.id);
  socket.on("login", user => {
    socket.userId = user;
    users[user] = socket.id;
    console.log("new socket", socket.id);
    console.log("connected users", users);
    socket.emit("login", users);
  });

  socket.on("notification", data => {
    console.log("notification received to backend", data);
    socket.to(users[data.id]).emit("notification", { users });
  });

  socket.on("clearNotifications", data => {
    socket.to(users[data.id]).emit("notification", { users });
  });

  socket.on("newMessage", data => {
    if (users[data.receiver]) {
      socket.to(users[data.receiver]).emit("newMessage", data);
      socket.to(users[data.receiver]).emit("notifMessage", data);
    }
  });

  socket.on("seenUpdated", data => {
    console.log("emit to ", users[data]);
    io.sockets.to(users[data]).emit("notifMessage", data);
  });

  socket.on("disconnect", () => {
    //delete users[socket.userId];
    console.log("disconnect", users);
  });
});
