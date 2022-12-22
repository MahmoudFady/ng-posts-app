const bcrypt = require("bcrypt");
const User = require("../models/user");
const getGeneratedToken = require("../helpers/generate-token");
module.exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  const isUserExist = (await User.findOne({ email })) ? true : false;
  if (isUserExist)
    return res.status(401).json({
      message: "email already exist",
    });

  const encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = await new User({
    email,
    password: encryptedPassword,
  }).save();
  const token = getGeneratedToken(newUser._id, newUser.email);
  res.status(200).json({
    message: "signup success",
    userId: newUser._id,
    expireDuration: 1 * 60 * 60,
    token,
  });
};
module.exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    return res.status(402).json({
      message: "email does not exist",
    });
  }
  const isPasswordSame = await bcrypt.compare(password, existedUser.password);
  if (!isPasswordSame) {
    return res.status(402).json({
      message: "password is wrong",
    });
  }
  const token = getGeneratedToken(existedUser._id, existedUser.email);
  res.status(200).json({
    message: "signin success",
    userId: existedUser._id,
    expireDuration: 1 * 60 * 60,
    token,
  });
};
