import express from "express";

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, userController.getUsers)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    userController.createUser
  );

// router.route("/signup").post(authContorller.signup);
// router.route("/login").post(authContorller.login);

// router.route("/forgotPassword").post(authContorller.forgotPassword);
// router.route("/resetPassword").post(authContorller.resetPassword);

router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  )
  .patch(authController.protect, userController.updateUser);

module.exports = router;
