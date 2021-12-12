const {connect} = require('mongoose');

async function connectDb()
{
    try
    {
        await connect(process.env.MONGODB_CONNECTION_LINK, 
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