const express = require('express')
const { handleRegister, handleLogin, handleLogout } = require('../controller/auth.controller')
const authRouter = express.Router()
const { validateRegister, validateLogin } = require('../validater/auth.validater')
const { checkAuth } = require('../middleware/auth.middleware')

authRouter.route('/register')
    .post(validateRegister, handleRegister)

authRouter.route('/login')
    .post(validateLogin, handleLogin)

authRouter.route('/logout')
    .post(checkAuth, handleLogout)

module.exports = { 
    authRouter
}