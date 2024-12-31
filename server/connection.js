import { connect } from 'mongoose';

async function connectToDatabase(){
    try{
        await connect(process.env.MONGODB_URL)
    }
    catch(error){
        console.log(error)
        throw new Error("Can't connect to mongodb")
    }
}

async function disconnectFromDB() {
    try{
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
    catch(error){
        console.log(error)
        throw new Error("Could not disconnect from mongodb")
    }
}

export { connectToDatabase, disconnectFromDB }