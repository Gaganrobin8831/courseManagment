const argon2 = require('argon2');
const ResponseUtil = require('../utility/respone.utility');
const { createToken } = require('../middleware/validate.middleware');
const { auth } = require('../models/auth.models');

async function handleRegister(req, res) {
    const { name, email, password, role } = req.body;

    try {
      
        const [existingauth, hashPassword] = await Promise.all([
            auth.findOne({ email }),
            argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 10,
                timeCost: 2,
                parallelism: 1,
            }),
        ]);

        
        if (existingauth) {
            return new ResponseUtil({
                success: false,
                message: 'You Are Already Registered',
                data: null,
                statusCode: 409,
            }, res);
        }

        
        const userRole = role || 'student';

        
        if (userRole === 'admin') {
            const existingAdmin = await auth.findOne({ role: 'admin' });
            if (existingAdmin) {
                return new ResponseUtil({
                    success: false,
                    message: 'Only one admin can be registered',
                    data: null,
                    statusCode: 409,
                }, res);
            }
        }

        
        const authData = new auth({
            name,
            email,
            password: hashPassword,
            role: userRole, 
        });

      
        await authData.save();

      
        const responseauthData = authData.toObject();
        delete responseauthData.password;

        return new ResponseUtil({
            success: true,
            message: 'Registered Successfully',
            data: responseauthData,
            statusCode: 200,
        }, res);

    } catch (error) {
        console.error(error);
        return new ResponseUtil({
            success: false,
            message: 'Error Occurred',
            data: null,
            statusCode: 500,
            errors: error.message || error,
        }, res);
    }
}

async function handleLogin(req, res) {
    const { email, password } = req.body
    try {

        const authData = await auth.findOne({ email });
        if (!authData) {
            return new ResponseUtil({
                success: false,
                message: 'Invalid Email or Password',
                data: null,
                statusCode: 401,
            }, res)
        }

        const decryptPassword = await argon2.verify(authData.password, password)
        if (!decryptPassword) {
            return new ResponseUtil({
                success: false,
                message: 'Invalid Email or Password',
                data: null,
                statusCode: 401,
            }, res)
        }

        const token = createToken(authData)
        const responseauthData = {
            name: authData.name,
            email: authData.email,
            role: authData.role,
            token
        }

        authData.token = token;
        authData.status = true
        await authData.save();

        return new ResponseUtil({
            success: true,
            message: 'Logged In Successfully',
            data: responseauthData,
            statusCode: 200,
        }, res)

    } catch (error) {
        console.log(error)
        return new ResponseUtil({
            success: false,
            message: 'Error Occurred',
            data: null,
            statusCode: 500,
            errors: error.message || error,
        }, res);
    }
}

async function handleAuthDetailEdit(req, res) {
    // console.log('Authenticated auth:', req.user);

    const { name, email, password } = req.body;
    // console.log({ name, email, password, countryCode, contactNumber })
    try {
        const { id } = req.user;
        const authData = await auth.findById(id);

        if (!authData) {
            return new ResponseUtil({
                success: false,
                message: 'auth not found',
                data: null,
                statusCode: 404,
            }, res);
        }

        const updatedData = {
            name: name || authData.name,

        };

        if (email !== authData.email) {
            return new ResponseUtil({
                success: false,
                message: 'You cannot update your email',
                data: null,
                statusCode: 400,
            }, res);
        }

        if (password) {
            updatedData.password = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 10,
                timeCost: 2,
                parallelism: 1,
            });
        }

        Object.assign(authData, updatedData);
        await authData.save();

        const responseauthData = authData.toObject();
        delete responseauthData.password;
        delete responseauthData.token;

        return new ResponseUtil({
            success: true,
            message: 'auth details updated successfully',
            data: responseauthData,
            statusCode: 200,
        }, res);

    } catch (error) {
        console.log(error);
        return new ResponseUtil({
            success: false,
            message: 'Error occurred while updating auth details',
            data: null,
            statusCode: 500,
            errors: error.message || error,
        }, res);
    }
}

async function handleLogout(req, res) {
    try {
        const { id } = req.user;
        const authData = await auth.findById(id);

        if (!authData) {
            return new ResponseUtil({
                success: false,
                message: 'User not found',
                data: null,
                statusCode: 404,
            }, res)

        }

        authData.token = null;
        authData.status = false
        await authData.save();
        return new ResponseUtil({
            success: true,
            message: "Logout successful",
            data: null,
            statusCode: 200
        }, res)
    } catch (error) {
        // console.error('Logout Error:', error);
        return new ResponseUtil({
            success: false,
            message: 'Tnternal Server Error',
            data: null,
            statusCode: 500,
            errors: error.message || error
        }, res)

    }
}

async function handleFullDetailOfauth(req, res) {
    const { id } = req.user;
    try {
        const authDetail = await auth.findById(id)
        if (!authDetail) {
            return new ResponseUtil({
                success: false,
                message: "Do Not Get Detail",
                data: null,
                statusCode: 404,
            }, res)
        }

        const authData = {
            id: authDetail._id,
            name: authDetail.name,
            email: authDetail.email,
            // PhoneNumber: `${authDetail.countryCode} ${authDetail.contactNumber}`,
            role: authDetail.role
        }

        return new ResponseUtil({
            success: true,
            message: "auth Detail",
            data: authData,
            statusCode: 200
        }, res)


    } catch (error) {
        return new ResponseUtil({
            success: false,
            message: "Internal Server error",
            data: null,
            statusCode: 500,
            errors: error.message || error
        }, res)
    }
}
module.exports = {
    handleRegister,
    handleLogin,
    handleAuthDetailEdit,
    handleLogout,
    handleFullDetailOfauth
};