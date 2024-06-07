// Connecting with database using mongoose

import mongoose from "mongoose";

async function connectionDB()
{
    try
    {
        const connectionObj = await mongoose.connect(process.env.MONGO_URL);

        console.log("Mongo DB connected successfully : " + connectionObj.connection.host);
    }
    catch(err)
    {
        console.log("Error in connecting with DB : ");
        console.log(err);
    }
}

export default connectionDB;