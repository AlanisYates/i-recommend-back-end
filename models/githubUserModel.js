const mongoose = require("mongoose");

const githubUserSchema = new mongoose.Schema({
  githubID: String,
  email: {
    type: String,
    trim: true,
  },
  username: String,
  name: String,
  userType: {
    type: String,
    default: "github",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const GithubUserModel = mongoose.model("GitUser", githubUserSchema);

module.exports = GithubUserModel;
