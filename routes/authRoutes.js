import express from "express";

const router = express.Router();

const authContorller = require("../controllers/authController");

router.route("/signup").post(authContorller.signup);
router.route("/login").post(authContorller.login);

router.route("/forgotPassword").post(authContorller.forgotPassword);
router.route("/resetPassword/:token").post(authContorller.resetPassword);

router.route("/oauth-callback").get(authContorller.requestGithubAPIAccessToken);
router.route("/oauth").get(authContorller.githubSignIn);

//router.route("/test").get(authContorller.getAllUsersFromAllDbs);
module.exports = router;
