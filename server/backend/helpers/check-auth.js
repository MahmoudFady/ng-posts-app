const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_KEY);
    next(decode);
  } catch {
    res.status(402).json({
      message: "auth faild",
    });
  }
};
