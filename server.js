const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
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
io.on("connection", socket => {
  socket.on("login", user => {
    if (users.findIndex(x => x.id === user) === -1 && user) {
      socket.userId = user;
      users.push({ id: user, notifications: 0 });
    }
    io.sockets.emit("login", { users });
    io.sockets.emit("notification", { users });
  });

  socket.on("notification", data => {
    users.find(x => {
      if (x.id === data.id) x.notifications += 1;
    });
    console.log(users);
    io.sockets.emit("notification", { users });
  });

  socket.on("clearNotifications", data => {
    users.find(x => {
      if (x.id === data.id) x.notifications = 0;
    });
    io.sockets.emit("notification", { users });
  });
  socket.on("disconnect", () => {
    users.find((o, i) => {
      if (o && o.id === socket.userId) {
        users.splice(i, 1);
      }
    });
  });
});
