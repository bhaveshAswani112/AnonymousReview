import mongoose , {Schema , Document} from "mongoose"

export interface Message extends Document {
    content : string,
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true,
    },

    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }

})

export interface User extends Document {
    username : string,
    password : string,
    email : string, 
    isAccepting : boolean,
    isVerified : boolean,
    verifyCode : string,
    verifyCodeExpiry : Date
    Messages : Message[]
}

const userSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true , "Username is required"],
        unique : true,
        trime : true
    },
    password : {
        type : String,
        requird : [true , "Password is required"]
    },
    email : {
        type : String,
        required : [true , "Email is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAccepting : {
        type : Boolean,
        default : false
    },
    verifyCode : {
        type : String
    },
    verifyCodeExpiry : {
        type : Date
    },
    Messages : {
        type : [MessageSchema]
    }

})

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model("User",userSchema))