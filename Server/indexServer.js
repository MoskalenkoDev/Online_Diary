const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDb = require('./connectDb');
const cors = require('cors');
const app = express();
const router = express.Router();
const userSignup = require('./userSignup');
const userLogin = require('./userLogin');
const profile_get_data = require('./profile_get_data');
const profile_post_data = require('./profile_post_data');
const add_new_class = require('./add_new_class');
const teacher_get_classes = require('./teacher_get_classes');
const teacher_delete_class = require('./teacher_delete_class');
const teacher_edit_class = require('./teacher_edit_class');

app.use('/', (req,res,next) =>{
    next();
})

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

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

app.use(userSignup);
app.use(userLogin);
app.use(profile_get_data);
app.use(profile_post_data);
app.use(add_new_class);
app.use(teacher_get_classes);
app.use(teacher_delete_class);
app.use(teacher_edit_class);
start();



