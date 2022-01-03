const express = require('express');
const connectDb = require('./connectDb');
const cors = require('cors');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const student_router = require('./router/student_router');
const teacher_router = require('./router/teacher_router');

app.use('/', (req,res,next) =>{
    next();
})

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT || 3001;
async function start()
{
    try
    {
        await connectDb();
        app.listen(PORT, ()=> {
        console.log("Server has been started at port", PORT);
        })
    }

    catch (e)
    {
        console.log(e);
    }
}

app.use("/student",student_router);
app.use("/teacher",teacher_router);
start();



