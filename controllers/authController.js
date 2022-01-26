import bcrypt from "bcrypt";
import mongoose from "mongoose";
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

async function sendJWT(res, user) {
  //jwt.sign();

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
}

exports.login = (req, res, next) => {
  try {
    // provide correct user and pass
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

    await sendJWT(res, user);
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
