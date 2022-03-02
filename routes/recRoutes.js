const express = require("express");
const recController = require("../controllers/recommendationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(recController.createRec)
  .get(authController.protect, recController.getRecs);
router
  .route("/:id")
  .get(recController.getRec)
  .patch(recController.updateRec)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    recController.deleteRec
  );

module.exports = router;
