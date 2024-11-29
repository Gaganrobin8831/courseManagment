require('dotenv').config()
const express = require('express')
const { connectDB } = require('./DB/database.DB')
const { authRouter } = require('./routes/auth.routes')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',authRouter)
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port http://localhost:${port}`)
    })
})
.catch((err) => console.log(err));