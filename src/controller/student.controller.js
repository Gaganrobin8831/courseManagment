const { auth } = require('../models/auth.models');
const ResponseUtil = require('../utility/respone.utility');

async function handleStudentDetail(req,res) {
    // const {id} = req.user
    const {id} = req.body
    try{
        const student = await auth.findOne({_id:id}).populate('courses')
        return new ResponseUtil({
            success: true,
            message: 'Successfully',
            data: student,
            statusCode: 200,
            
        }, res);

    }catch(error){
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
module.exports = {
    handleStudentDetail
}