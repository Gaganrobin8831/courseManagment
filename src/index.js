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
const studentRouter = require('./routes/student.routes')

// require and intilize the swagger and yaml
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',authRouter)
app.use('/api',courseRouter)
app.use('/api',lessonRouter)
app.use('/api',quizRouter)
app.use('/api',adminRouter)
app.use('/api',studentRouter)


connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port http://localhost:${port}`)
    })
})
.catch((err) => console.log(err));