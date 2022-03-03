const express = require("express");
const recController = require("../controllers/recommendationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, recController.createRec)
  .get(authController.protect, recController.getRecs);
router
  .route("/:id")
  .get(authController.protect, recController.getRec)
  .patch(authController.protect, recController.updateRec)
  .delete(authController.protect, recController.deleteRec);

module.exports = router;
