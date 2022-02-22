const mongoose = require("mongoose");

const githubUserSchema = new mongoose.Schema({
  githubID: String,
  email: {
    type: String,
    trim: true,
  },
  username: String,
  name: String,
});

const GithubUserModel = mongoose.model("GitUser", githubUserSchema);

module.exports = GithubUserModel;
