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
let users = [];
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
  console.log("new socket connected");
  socket.on("login", user => {
    if (users.findIndex(x => x.id === user) === -1 && user) {
      socket.userId = user;
      users.push({ socket: socket.id, id: user, notifications: 0 });
    }
    console.log("connected users", users);
    io.sockets.emit("login", { users });
    //io.sockets.emit("notification", { users });
  });

  socket.on("notify", data => {
    console.log("comming notification to the server", data);
    users.find(x => {
      if (x.id === data.id) {
        x.notifications += 1;
        console.log("emit notification from server to ", x.id);
        console.log(x.socket);
        io.sockets.to(x.socket).emit("notify", { users });
      }
    });
  });

  socket.on("clearNotifications", data => {
    console.log("comming ClearNotifications to the server", data);
    users.find(x => {
      if (x.id === data.id) {
        x.notifications = 0;
        console.log("clear notifications for user: ", x.socket, x.id, users);
        socket.to(x.socket).emit("notify", { users });
      }
    });
  });
  socket.on("disconnect", () => {
    users.find((o, i) => {
      if (o && o.id === socket.userId) {
        users.splice(i, 1);
      }
    });
  });
});
