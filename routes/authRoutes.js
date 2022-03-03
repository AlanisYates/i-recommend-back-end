import express from "express";

const router = express.Router();

const authContorller = require("../controllers/authController");
const githubAuthContorller = require("../controllers/githubAuthController");

router.route("/signup").post(authContorller.signup);
router.route("/login").post(authContorller.login);

router.route("/forgotPassword").post(authContorller.forgotPassword);
router.route("/resetPassword/:token").post(authContorller.resetPassword);

router
  .route("/git-oauth-callback")
  .get(githubAuthContorller.requestGithubAPIAccessToken);
router.route("/git-oauth").get(githubAuthContorller.githubSignIn);

//router.route("/test").get(authContorller.getAllUsersFromAllDbs);
module.exports = router;
