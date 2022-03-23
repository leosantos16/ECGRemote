const router = require("express").Router()
const ObservationController = require('../controller/ObservationController');

router.post("/baseR4/Observation", ObservationController.createObeservation)

router.get("/baseR4/Observation/:id", ObservationController.getObservationById)

router.patch("/baseR4/Observation/:id", ObservationController.patchComponent);

module.exports = router