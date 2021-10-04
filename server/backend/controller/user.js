const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
module.exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await new User({
      email,
      password: hash,
    }).save();
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "signup success",
      userId: newUser._id,
      expireDuration: 1 * 60 * 60,
      token,
    });
  }
  res.status(401).json({
    message: "email already exist",
  });
};
module.exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    const isPasswordSame = await bcrypt.compare(password, userExist.password);
    if (isPasswordSame) {
      const token = jwt.sign(
        {
          id: userExist._id,
          email: userExist.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "signin success",
        userId: userExist._id,
        expireDuration: 1 * 60 * 60,
        token,
      });
    }
    res.status(402).json({
      message: "password is wrong",
    });
  }
  res.status(402).json({
    message: "email does not exist",
  });
};
