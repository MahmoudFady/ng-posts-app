const jwt = require("jsonwebtoken");
module.exports = (id, email) => {
  const token = jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};
