const userModel = require('../models/userModel')
const { sendOTPEmail } = require('./emailController')
const jwt = require('jsonwebtoken')

module.exports = {
    fetchUser: async (req, res, next) => {
        const { email } = req.body.data
        try {
            let fetchResponse = await userModel.findOne({ email })
            if (fetchResponse) {
                res.status(200).json({ status: true, data: fetchResponse })
            }
            else {
                res.status(400).json({ status: false, type: 'notexists' })
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ status: false })
        }
    },

    login: async (req, res, next) => {
        console.log(req.body)
        const { email } = req.body.data
        try {
            let fetchResponse = await userModel.findOne({ email })
            if (fetchResponse) {
                const OTP = Math.floor(1000 + Math.random() * 9000);
                const otpResponse = await sendOTPEmail(email, OTP, fetchResponse.name)
                let id = fetchResponse._id
                const token = jwt.sign({ id, email: fetchResponse.email }, process.env.JWT_SECRET, {
                    expiresIn: '150d'
                })
                if (otpResponse) {
                    res.status(200).json({ status: true, data: fetchResponse, OTP, jwt : token })
                }
                else {
                    res.status(400).json({ status: false })
                }
            }
            else {
                res.status(400).json({ status: false, type: 'notexists' })
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ status: false })
        }
    },

    resendOTP: async (req, res, next) => {
        const { email, name } = req.body.data
        try {
            const OTP = Math.floor(1000 + Math.random() * 9000);
            const otpResponse = await sendOTPEmail(email, OTP, name)
            if (otpResponse) {
                console.log({ status: true, OTP })
                res.status(200).json({ status: true, OTP })
            }
            else {
                res.status(400).json({ status: false })
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).json({ status: false })
        }
    }
}