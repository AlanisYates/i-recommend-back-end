const express = require("express");

const itinController = require("../controllers/itinerariesController");

const router = express.Router();

router.route("/").get(itinController.getItins).post(itinController.createItin);

router
  .route("/:id")
  .get(itinController.getItin)
  .patch(itinController.updateItin)
  .delete(itinController.deleteItin);

module.exports = router;
