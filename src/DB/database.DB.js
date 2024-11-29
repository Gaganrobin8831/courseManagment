const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL,{
            maxPoolSize : 10,
        })
        const response =  conn.connection.host
        console.log(`Connected to MongoDB: ${response}`)
    }
    catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = { 
    connectDB
}