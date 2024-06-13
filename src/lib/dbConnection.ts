import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}


export const connectDb = async () : Promise<void> => {
    if(connection?.isConnected){
        console.log("Already connected to database")
        return 
    }

    try {
        const db : any = await mongoose.connect(`${process.env.MONGODB_URI}/AnonymousReview`)
        // console.log(db)
        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        // @ts-ignore
        console.log("Database connection failed " + error.message)
        process.exit(1)
    }

}

