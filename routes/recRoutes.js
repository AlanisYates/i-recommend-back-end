const express = require("express");
const recController = require("../controllers/recommendationController");

const router = express.Router();

router.route("/").post(recController.createRec).get(recController.getRecs);
router
  .route("/:id")
  .get(recController.getRec)
  .patch(recController.updateRec)
  .delete(recController.deleteRec);

module.exports = router;
