const express = require("express");
//const db = require("./config/db");

const app = express();

// Database connection
// db.connectDb();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Api Running"));

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Backend server Started.."));
