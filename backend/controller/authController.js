const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const employeeModel = require('../models/employeeDataModel')
const { sendOTPEmail } = require('../controller/emailController')

module.exports = {
    signInController: async (req, res, next) => {
        const { empid, password } = req.body

        try {
            const user = await employeeModel.loginUser(empid, password)
            let id = user._id
            const token = jwt.sign({ id, accountType: user.accountType }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })
            res.cookie('jwt', token, { httpOnly: false,secure:true,sameSite: 'none',  maxAge: process.env.JWT_MAXAGE * 1000 })
            let userTokenData = { name: user.name, accountType: user.accountType,userId : user.empid }
            if(user.accountType == '1'){
                console.log('inside if')
                userTokenData['accessRights'] = user.accessRights
            }
            console.log(user.accountType == '1')
            res.cookie('user_token',  userTokenData, {httpOnly: false,secure:true,sameSite: 'none', maxAge: process.env.JWT_MAXAGE * 1000 })
            res.status(200).json({ status: true,userData:{accountType : user.accountType} })
        }
        catch (err) {
            if (err.message == 'notfound') {
                res.status(200).json({ status: false, type: "notfound" })
            }
            else if (err.message == 'incpass') {
                res.status(406).json({ status: false, type: "incpass" })
            }
            else {
                res.status(400).json({ status: false, type: "someeerror" })
            }
        }
    },

    passwordResetValidateController: async (req, res) => {
        const { empid, email } = req.body

        try {
            const validateResponse = await employeeModel.validateCredentials(empid, email)
            const OTP = Math.floor(1000 + Math.random() * 9000);
            let emailSentResponse = await sendOTPEmail(email, OTP, validateResponse.name)
            const token = jwt.sign({ id: validateResponse.id, OTP }, process.env.JWT_SECRET, {
                expiresIn: 60 * 5
            })
            res.cookie('jwt_otp', token, { httpOnly: true, maxAge: 60 * 5 * 1000 })
            res.status(200).json({ status: true })
        }
        catch (err) {
            if (err.message == 'notfound') {
                res.status(404).json({ status: false, type: "notfound" })
            }
            else if (err.message == 'inccred') {
                res.status(406).json({ status: false, type: "inccred" })
            }
            else {
                res.status(400).json({ status: false, type: "someeerror" })
            }
        }
    },

    validateOTP: async (req, res) => {
        const { OTP } = req.body
        const decodedOTP = req.decodedOTP
        if (parseInt(OTP) == decodedOTP) {
            // req.cookie('jwt','',{maxAge : 1})
            res.status(200).json({status : true})
        }
        else {
            res.status(400).json({status : false})
        }
    },

    passwordResetController: async (req, res) => {
        const {password } = req.body
        const id = req.id

        try {
            const validateResponse = await employeeModel.resetPassword(id, password)
            res.cookie('jwt_otp', '', { maxAge: 1 })
            res.status(200).json({ status: true })
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ status: false})
        }
    },

    logout : (req, res) => {
        console.log('logout')
        try {
            res.cookie('jwt', '', { maxAge: 1 })
            res.status(200).json({})
        }
        catch (err) {
            res.status(400).json({})
        }
    },

    // addUser: async (request, response) => {
    //     const user = new employeeModel(request.body)
    //     user.save()
    //         .then((doc) => {
    //             console.log(doc);
    //             response.send('Success created')
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }
} 