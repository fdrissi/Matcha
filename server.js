const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cors());

// Set up express session middleware
app.use(cookieParser());

// Init Middleware
app.use(express.json({ extended: false }));

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
//app.use("/api/socket", require("./routes/api/socket"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log("Backend server Started.."));
// Init socket io
const io = require("socket.io").listen(server, { pingInterval: 60000 });
//Share it
//app.set("io", io);
let users = [];
io.on("connection", socket => {
  socket.on("login", user => users.push(user));
  io.sockets.emit("login", { users });
  socket.on("disconnect", sr => console.log(sr));
});
