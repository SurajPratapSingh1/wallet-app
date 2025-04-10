const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({ error: "No token provided" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ error: "Token expired, please login again" });
        }
        return res.status(401).json({ error: "Invalid token" });
      }
}