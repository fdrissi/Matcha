const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token){
        return res.status(401).json({ errorMsg: "Access denied"});
    }

    try {
        const decoded = jwt.decode(token, config.get('keyOrSecret'));
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ errorMsg: "Access denied"});
    }
}