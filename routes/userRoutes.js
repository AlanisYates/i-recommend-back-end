import express from "express";

const userController = require("../controllers/userController");

const router = express.Router();

router.route("/").get(userController.getUsers).post(userController.createUser);

// router.route("/signup").post(authContorller.signup);
// router.route("/login").post(authContorller.login);

// router.route("/forgotPassword").post(authContorller.forgotPassword);
// router.route("/resetPassword").post(authContorller.resetPassword);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
