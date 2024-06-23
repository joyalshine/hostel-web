const jwt = require('jsonwebtoken')


module.exports = {
    superAdminAuthCheck: (req, res, next) => {
        const token = req.cookies.jwt
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log(err)
                    res.status(401).json({ valid: false })
                }
                else {
                    if (decodedToken.accountType == '0') {
                        next()
                    }
                    else {
                        // res.status(401).json({ valid: false })
                        next()
                    }
                }
            })
        }
        else {
            res.status(401).json({ valid: false })
        }
    },

    appAuthCheck: (req, res, next) => {
        if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] == 'Bearer') {
            const token = req.headers['authorization'].split(' ')[1]
            console.log('token')
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    res.status(403).json({ valid: false })
                }
                else {
                    next()
                }
            })
        }
        else {
            console.log('else')
            res.status(403).json({ valid: false })
        }
    },

    passwordResetAuthCheck: (req, res, next) => {
        const token = req.cookies.jwt_otp

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log(err)
                    res.status(401).json({ valid: false })
                }
                else {
                    req.decodedOTP = decodedToken.OTP
                    req.id = decodedToken.id
                    console.log(decodedToken)
                    next()
                }
            })
        }
        else {
            res.status(401).json({ valid: false })
        }
    }
}
