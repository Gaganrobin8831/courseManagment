const express = require('express')
const { handleRegister, handleLogin, handleLogout } = require('../controller/auth.controller')
const authRouter = express.Router()
const { validateRegister, validateLogin } = require('../validater/auth.validater')
const { checkAuth } = require('../middleware/auth.middleware')

// resgister using { name, email, password}
authRouter.route('/register')
    .post(validateRegister, handleRegister)
// login using { email, password }
authRouter.route('/login')
    .post(validateLogin, handleLogin)
// logout using jwt auth
authRouter.route('/logout')
    .post(checkAuth, handleLogout)

module.exports = { 
    authRouter
}