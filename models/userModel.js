import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

// Set the passwordChandedAt field in the db if pasword is ever reset later
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // -1000 incase the DB takes longer to save than the JWT creation
  next();
});

// Encrypt the password that is saved into the DB upon reset or signup
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // preventing passConfirm from saving into the DB
  next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
