import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please, include a username"],
    maxlength: 20,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    maxlength: 100,
    minlength: 8,
    required: [true, "Please, include a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please, confirm your password"],
    validate: {
      validator: function (field) {
        return field === this.password;
      },
      message: "Passwords do not match",
    },
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please, include an email address"],
    trim: true,
    validate: [validator.isEmail, "Please, enter a valid email address"],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
