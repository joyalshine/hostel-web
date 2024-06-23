var express = require("express");
var router = express.Router();

const appController = require('../controller/appController')
const appAuthController = require('../controller/appAuthController')
const authMiddleware = require('../middleware/authMiddleware')

router.post("/add-cleaning-complaint",authMiddleware.appAuthCheck,appController.addCleaningRequest)
router.post("/add-maintenance-complaint",authMiddleware.appAuthCheck,appController.addMaintenaceRequest)
router.post("/add-discipline-complaint",authMiddleware.appAuthCheck,appController.addDisciplineRequest)
router.post("/add-mess-complaint",authMiddleware.appAuthCheck,appController.addMessRequest)
router.post("/login",appAuthController.login)
router.post("/fetch-user",authMiddleware.appAuthCheck,appAuthController.fetchUser)
router.post("/resend-otp",appAuthController.resendOTP)
router.post("/fetch-complaints",authMiddleware.appAuthCheck,appController.fetchAlluserComplaints)
router.post("/fetch-menu",authMiddleware.appAuthCheck,appController.fetchMenu)
router.post("/fetch-complaint-update",authMiddleware.appAuthCheck,appController.fetchIndividualComplaint)


module.exports = router;
