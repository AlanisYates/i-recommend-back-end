import bcrypt from "bcrypt";

const User = require("../models/userModel");

exports.getUsers = async function (req, res, next) {
  try {
    const users = await User.find();

    await res.status(200).json({
      status: "success",
      results: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    //console.log(user);

    await res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async function (req, res, next) {
  try {
    const { username, password, passwordConfirm, email } = req.body;

    const body = {
      password,
      passwordConfirm,
      email,
      username,
    };

    //console.log("creating User: \n", username, "\n", email);
    const newUser = await User.create(body);

    await res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    const id = req.params.id;
    const { email, username } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { email, username },
      {
        new: true,
        runValidatiors: true,
      }
    );
    console.log(user);

    await res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async function (req, res, next) {
  try {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    console.log(deletedUser);

    if (!deletedUser) {
      return next(new Error("No User found with that ID"));
    }
    await res.status(204).json({
      status: "success",
      data: {
        user: null,
      },
    });
  } catch (err) {
    next(err);
  }
};
