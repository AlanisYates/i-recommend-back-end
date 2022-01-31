import crypto from "crypto";
import mongoose from "mongoose";
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const sendEmail = require("../utils/email");

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
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Please, provide both username and password");
    }

    const user = await User.findOne({ username: username }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Username or password is incorrect");
    }

    sendJWT(res, user);
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new Error(`Email ${req.body.email} does not yet have an account`)
      );
    }

    // Create a reset token for the current user document and save it back to the database
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // Send an email with a the acess token.
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/auth/resetPassword/${resetToken}`;

    const message = `Forgot Password reset link: ${resetURL}\nIf you didn't forget your password, please ignore this email.`;

    await sendEmail(user.email, "Password Reset Link", message);

    res.status(201).json({
      status: "success",
      data: {
        message: `Password reset link sent to ${user.email}`,
      },
    });
  } catch (err) {
    // reset fields that were modified in createPasswordResetToken()
    const user = await User.findOne({ username: req.body.username });
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // We hashed the reset token before saving to the DB, so to verify we must hash the req.params token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({ passwordResetToken: hashedToken });

    if (!user || user.passwordResetExpires < Date.now()) {
      return next(new Error("Reset Token is invalid or expired."));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    user.password = undefined; // remove password from output
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
