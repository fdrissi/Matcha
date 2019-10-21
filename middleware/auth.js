const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, errorMsg: "Access denied" });
  }

  try {
    const decoded = jwt.decode(token, config.get("keyOrSecret"));
    if (Date.now() >= decoded.exp * 1000) {
      res.clearCookie("token");
      return res.json({ success: false, errorMsg: "Access denied" });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.json({ success: false, errorMsg: "Access denied" });
  }
};
