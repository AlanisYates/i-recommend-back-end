import bcrypt from "bcrypt";
import mongoose from "mongoose";
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const signJWT = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

function sendJWT(res, user) {
  const token = signJWT(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000 // convert days to milisec
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // remove password field from output

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.login = async (req, res, next) => {
  try {
    // provide correct user and pass
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Please, provide both username and password");
    }

    const user = await User.findOne({ username: username }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Username or password is incorrect");
    }

    sendJWT(res, user);
    // jwt expired
    //
    // give jwt
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    // create user
    // encrypt pass. dont save pass confirm
    const { username, password, passwordConfirm, email } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    sendJWT(res, user);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = () => {
  // send reset link
};

exports.resetPassword = () => {
  // submit new password
  // encrypt and save to db
};
