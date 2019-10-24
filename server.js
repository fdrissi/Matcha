const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//const db = require("./config/db");

const app = express();
app.use(cors());

// Set up express session middleware
app.use(cookieParser());
// app.use(
//   session({
//     secret: "fdrissiabelomar",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 3600,
//       httpOnly: true
//     }
//   })
// );

// Init Middleware
app.use(express.json({ extended: false }));

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/user", require("./routes/activation"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Backend server Started.."));
