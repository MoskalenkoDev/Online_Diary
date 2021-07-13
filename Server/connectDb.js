const mongoose = require('mongoose');

async function connectDb()
{
    try
    {
        await mongoose.connect('mongodb+srv://nikolas2:<password>@cluster0.xfza0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', // insert your connection link here
        {
            useNewUrlParser : true,
            useFindAndModify : false,
            useUnifiedTopology: true
        })
        console.log("К базе подключился");
    }

    catch (e)
    {
        console.log(e);
    }
}

module.exports = connectDb;