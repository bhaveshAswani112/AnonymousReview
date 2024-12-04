import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

const mongodburi = process.env.MONGODB_URI || "mongodb://username:password@localhost:27017"


export const connectDb = async () : Promise<void> => {
    if(connection?.isConnected){
        console.log(connection.isConnected)
        console.log("Already connected to database")
        return 
    }
    
    console.log(mongodburi)
    try {
        console.log("Hello I am NODE ENV")
        console.log(process.env.NODE_ENV)
        if(process?.env?.NODE_ENV === 'production'){
            const db : any = await mongoose.connect(`${mongodburi}/AnonymousReview`)
            // console.log(db)
            connection.isConnected = db.connections[0].readyState
        }
    } catch (error) {
        // @ts-ignore
        console.log("Database connection failed " + error.message)
        process.exit(1)
    } finally {
        console.log(connection.isConnected)
        console.log("Database connected successfully.")
    }

}

