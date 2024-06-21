import { User, getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { UserModel } from "@/model/User"
import { NextApiRequest } from "next"

export  async function DELETE(req : NextApiRequest,{params} :  {params : {messageId : string[]}}){
    try {
        const session = await getServerSession(authOptions)
        const sessionUser : User = session?.user as User
        const id = params.messageId[0]
        // console.log("I am message id")
        // console.log(id)
        if(!sessionUser){
            return Response.json({
                success : false,
                message : "User not Authorized"
            })
        }
        const updatedUser = await UserModel.updateOne({
            _id : sessionUser._id
        },{
            $pull : {Messages : {_id : id}}
        },{
            new : true
        })
        // console.log(updatedUser)
        if(!updatedUser){
            return Response.json({
                success : false,
                message : "Error in deleting Message"
            },{
                status : 400
            })
        }
        return Response.json({
            success : true,
            message : "Message deleted successfully"
        },{
            status : 200
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            success : false,
            message : "Error in deleting Message"
        },{
            status : 500
        })
    }
}