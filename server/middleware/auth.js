const jwt = require("jsonwebtoken");

exports.verifyAdminToken = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
