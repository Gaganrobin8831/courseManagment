require('dotenv').config()
const express = require('express')
const { connectDB } = require('./DB/database.DB')
const { authRouter } = require('./routes/auth.routes')
const courseRouter = require('./routes/course.routes')
const app = express()
const port = process.env.PORT || 3000
const compression = require('compression')
const lessonRouter = require('./routes/lesson.routes')
const quizRouter = require('./routes/quiz.routes')
const adminRouter = require('./routes/admin.routes')
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',authRouter)
app.use('/api',courseRouter)
app.use('/api',lessonRouter)
app.use('/api',quizRouter)
app.use('/api',adminRouter)
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port http://localhost:${port}`)
    })
})
.catch((err) => console.log(err));