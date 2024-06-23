var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken')
const authController = require('../controller/authController')
const authMiddleware = require('../middleware/authMiddleware')


router.post("/signin", authController.signInController)
router.post("/validate-otp", authMiddleware.passwordResetAuthCheck, authController.validateOTP)
router.post("/password-reset-validate", authController.passwordResetValidateController)
router.post("/password-reset", authMiddleware.passwordResetAuthCheck, authController.passwordResetController)
router.post("/logout", authController.logout)


module.exports = router;
