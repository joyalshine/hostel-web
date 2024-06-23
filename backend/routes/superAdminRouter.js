const express = require("express");
const router = express.Router();

const superAdminController = require("./../controller/superAdminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/fetch-student-data",
  authMiddleware.superAdminAuthCheck,
  superAdminController.searchStudentDataDb
);
router.post(
  "/fetch-student-complaints",
  authMiddleware.superAdminAuthCheck,
  superAdminController.searchStudentHistoryDb
);
router.post(
  "/update-student-data",
  authMiddleware.superAdminAuthCheck,
  superAdminController.updateStudentDataDb
);
router.post(
  "/add-student",
  authMiddleware.superAdminAuthCheck,
  superAdminController.addStudentDb
);
router.post(
  "/student-excel-upload",
  authMiddleware.superAdminAuthCheck,
  superAdminController.addStudentExcelDb
);
router.post(
  "/add-user",
  authMiddleware.superAdminAuthCheck,
  superAdminController.addNewUser
);
router.post(
  "/check-menuexists",
  authMiddleware.superAdminAuthCheck,
  superAdminController.checkMenuExist
);
router.post(
  "/upload-messmenu",
  authMiddleware.superAdminAuthCheck,
  superAdminController.uploadMessMenuDB
);
router.post(
  "/fetch-messmenu-keys",
  authMiddleware.superAdminAuthCheck,
  superAdminController.fetchMessMenuHistoryKeys
);
router.post(
  "/fetch-messmenu",
  authMiddleware.superAdminAuthCheck,
  superAdminController.fetchMessMenuHistoryDB
);
router.post(
  "/delete-student",
  authMiddleware.superAdminAuthCheck,
  superAdminController.deleteStudentDB
);

router.route("/maintenance").post(superAdminController.getAllComplains);

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
    .post(authMiddleware.superAdminAuthCheck, (req, res, next) =>
      superAdminController.getAllComplains(route.model, req, res, next)
    );
  router
    .route(`/${route.path}/updateStatus`)
    .post(authMiddleware.superAdminAuthCheck, (req, res, next) =>
      superAdminController.updateComplain(route.model, req, res, next)
    );
  router
    .route(`/${route.path}/history`)
    .post(authMiddleware.superAdminAuthCheck, (req, res, next) =>
      superAdminController.getHistoryComplains(route.model, req, res, next)
    );
});

module.exports = router;
