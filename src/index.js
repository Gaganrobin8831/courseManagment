require('dotenv').config()
const express = require('express')
const { connectDB } = require('./DB/database.DB')
const app = express()
const port = process.env.PORT || 3000


connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port http://localhost:${port}`)
    })
})
.catch((err) => console.log(err));