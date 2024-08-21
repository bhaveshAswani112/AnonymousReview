import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

const mongodburi = process.env.MONGODB_URI || "mongodb://username:password@localhost:27017"


export const connectDb = async () : Promise<void> => {
    if(connection?.isConnected){
        console.log("Already connected to database")
        return 
    }

    try {
        const db : any = await mongoose.connect(`${mongodburi}/AnonymousReview`)
        // console.log(db)
        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        // @ts-ignore
        console.log("Database connection failed " + error.message)
        process.exit(1)
    }

}

