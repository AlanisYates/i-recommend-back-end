const express = require("express");

const itinController = require("../controllers/itinerariesController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, itinController.getItins)
  .post(authController.protect, itinController.createItin);

router
  .route("/:id")
  .get(authController.protect, itinController.getItin)
  .patch(authController.protect, itinController.updateItin)
  .delete(authController.protect, itinController.deleteItin);

module.exports = router;
