const express = require('express');
const connectDb = require('./connectDb');
const cors = require('cors');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error_middleware');
require('dotenv').config();

const both_user_types_router = require('./router/both_user_types_router');
const student_router = require('./router/student_router');
const teacher_router = require('./router/teacher_router');
const activate_mail_router = require('./router/activate_mail_router');

app.use('/', (req,res,next) =>{
    next();
})

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.FRONT_END_URL
}));
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

app.use("/student",both_user_types_router, student_router ); // явно мені ще треба добавити міделвер общого призначення і для вчителя і для учня ну і оставити окремі теж
app.use("/teacher",both_user_types_router, teacher_router );
app.use("/api", activate_mail_router);

app.use(errorMiddleware); // this one should be last in the chain of middlewares
start();



