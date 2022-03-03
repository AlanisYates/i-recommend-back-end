import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";

const jwt = require("../utils/jwtUtils");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");

dotenv.config({ path: "../config.env" });

exports.protect = async (req, res, next) => {
  try {
    let token;
    //console.log(req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new Error("Please, log in before accessing this page"));
    }

    const payload = await jwt.verifyJWT(token);

    //console.log(payload);
    if (!payload) {
      return next(new Error("JWT is invalid, Please sign in again"));
    }

    const user = await findUser(payload.id);

    //console.log(user);

    if (!user) {
      return next(
        new Error("The user associated with this JWT no longer exists")
      );
    }

    // Set the user property on the req obj to use for later middlewares
    req.user = user;
    //console.log(req.user);

    // all checks are passed, proceed to the protected route
    next();
  } catch (error) {
    next(error);
  }
};

// restrict to is a wrapper function that returns the actual middleware function. needed to pass in paramaters to the
// middleware function. make sure protect() middleware runs before this func for teh curr user to be put on teh req object
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new Error("This account is forbidden from performing this action.")
      );
    }

    next();
  };
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Please, provide both username and password");
    }

    const user = await User.findOne({ username: username }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error("Username or password is incorrect"));
    }

    jwt.sendJWT(res, user);
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

    jwt.sendJWT(res, user);
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

// Get user by ID from any of the User databases.
const findUser = async function (id) {
  try {
    const user = await User.aggregate([
      {
        $unionWith: {
          coll: "gitusers",
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
    ]);

    return user[0];
  } catch (error) {
    next(error);
  }
};
