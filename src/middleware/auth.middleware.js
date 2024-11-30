
const ResponseUtil = require("../utility/respone.utility");
const { validateToken } = require("./validate.middleware");
const { auth } = require('../models/auth.models');


async function checkAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    // console.log({token})
    if (!token) {
        return new ResponseUtil({
            success: false,
            message: 'Unauthorized',
            data: null,
            statusCode: 401,
        }, res);
    }


    try {
        const adminPayload = validateToken(token)
        req.user = adminPayload
        const { id } = req.user
        const adminData = await auth.findById(id);
        if (adminData.token === null) {
            return new ResponseUtil({
                success: false,
                message: 'Unauthorized',
                data: null,
                statusCode: 401,
            }, res);
        }
        next()
    } catch (error) {

        return new ResponseUtil({
            success: false,
            message: 'Sonething Wrong',
            data: null,
            statusCode: 500,
            errors: error || error.message
        }, res);
    }
}

module.exports = {
    checkAuth
}