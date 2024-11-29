const express = require('express')
const { handleRegister, handleLogin, handleAuthDetailEdit, handleLogout, handleFullDetailOfauth } = require('../controller/auth.controller')
const authRouter = express.Router()
const { validateRegister, validateLogin } = require('../validater/auth.validater')
const { checkAuth } = require('../middleware/auth.middleware')

authRouter.route('/register')
    .post(validateRegister, handleRegister)

authRouter.route('/login')
    .post(validateLogin, handleLogin)

authRouter.route('/detailAdmin')
    .get(checkAuth, handleFullDetailOfauth)

authRouter.route('/logout')
    .post(checkAuth, handleLogout)

authRouter.route('/editadmindetail')
    .put(checkAuth, validateRegister, handleAuthDetailEdit)

module.exports = { 
    authRouter
}