import { ApiError } from "../utils/ApiError.js"
import { message } from "../utils/message.js"
import jwt from "jsonwebtoken"

export const isAuthenticated = (req,res,next)=>{
    try {

        const accessToken = req.headers?.authorization?.split(" ")[1]

        if(!accessToken){
            throw new ApiError(401,message.UNAUTHORIZED_USER)
        }

        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

        if(!decode){
            throw new ApiError(401,message.UNAUTHORIZED_USER)
        }

        req.user = decode

        next()
    } catch (error) {
        console.log("token verify middleware error:",error)
        next(error)
    }
}