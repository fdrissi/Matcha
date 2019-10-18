const express = require("express");
const cors = require('cors');
//const db = require("./config/db");

const app = express();
app.use(cors());

// Database connection
// db.connectDb();

// Init Middleware
app.use(express.json({ extended: false }));

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Backend server Started.."));
