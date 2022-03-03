import superagent from "superagent";
import dotenv from "dotenv";

const GitUser = require("../models/githubUserModel");
const jwt = require("../utils/jwtUtils");

dotenv.config({ path: "../config.env" });

// Call this function to sign in with github using OAuth
// Sends the user to Github to sign in. After, they are redirected to the /oauth-callback route. That
// route calls teh requestGithubAPIAccessToken() function
exports.githubSignIn = function (req, res, next) {
  try {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
  } catch (err) {
    next(err);
  }
};

// After user signs in at Github, they get an API access token which we can use to get their github account data.
// This function pulls out the access token and then calls the function which uses the token to get their github data.
exports.requestGithubAPIAccessToken = async function (req, res, next) {
  try {
    const response = await superagent
      .post(`https://github.com/login/oauth/access_token`)
      .send({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
      });

    const params = new URLSearchParams(response.text);
    const accessToken = params.get("access_token");

    requestGithubAPI(res, accessToken, next);
  } catch (err) {
    next(err);
  }
};

// Afrer getting the access token, we then use it to get access to Github's API on behalf of the user. Through
// The API we can get their githubID. We use this data to finally sign the user into our app.
const requestGithubAPI = async function (res, accessToken, next) {
  try {
    const response = await superagent
      .get("https://api.github.com/user")
      .set("Authorization", `token ${accessToken}`)
      .set("Accept", "application/json")
      .set("user-agent", "node.js");

    const githubData = JSON.parse(response.text);

    //console.log(githubData);

    let user = await GitUser.findOne({ githubID: githubData.id });
    // If they don't have a user in the DB, then its the first time they are signing in.
    if (!user) {
      user = await createGithubUser(githubData);
    }

    //console.log(user);

    jwt.sendJWT(res, user);
  } catch (err) {
    next(err);
  }
};

// Users never need to create an account if they sign in with github, so we automatically create a user
// entry for them in teh githubUsers DB.
const createGithubUser = async function (githubUserData) {
  const dbData = githubUserData;
  dbData.githubID = dbData.id;
  dbData.username = dbData.login;
  //dbData.userType = "github";

  const user = await GitUser.create(dbData);

  return user;
};
