const express = require("express");
const router = express.Router();

const controller = require("../controller/superAdminController");

const models = {
  Maintenance: require("./../models/maintenanceModel"),
  Cleaning: require("./../models/cleaningModel"),
  Discipline: require("./../models/disciplineModel"),
  Mess: require("./../models/messModel"),
};

// Define route details in an array
const routes = [
  { path: "maintenance", model: models.Maintenance },
  { path: "cleaning", model: models.Cleaning },
  { path: "discipline", model: models.Discipline },
  { path: "mess", model: models.Mess },
];

// Register routes dynamically
routes.forEach((route) => {
  router
    .route(`/${route.path}`)
    .post((req, res, next) =>
      controller.getAllComplains(route.model, req, res, next)
    );
  router
    .route(`/${route.path}/updateStatus`)
    .post((req, res, next) =>
      controller.updateComplain(route.model, req, res, next)
    );
});

module.exports = router;
