import express from "express";

const userController = require("../controllers/userController");
const authContorller = require("../controllers/authController");

const router = express.Router();

router.route("/").get(userController.getUsers).post(userController.createUser);

router.route("/signup").post(authContorller.signup);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
