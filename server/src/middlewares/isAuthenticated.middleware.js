import { ApiError } from "../utils/ApiError.js"
import { message } from "../utils/message.js"
import jwt from "jsonwebtoken"

export const isAuthenticated = (req,res,next)=>{
    try {

        const authHeader = req.headers.authorization

        if(!authHeader){
            throw new ApiError(401,message.UNAUTHORIZED_USER)
        }

        const accessToken = authHeader.startsWith("Bearer ")?authHeader.split(" ")[1] : null

        if(!accessToken){
            throw new ApiError(401,message.UNAUTHORIZED_USER)
        }

        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

        req.user = decode

        next()
    } catch (error) {
        console.log("token verify middleware error:",error)

        if(error.name === "TokenExpiredError"){
            return next(new ApiError(401,message.TOKEN_EXPIRED))
        }

        if(error.name === "JsonWebTokenError"){
            return next(new ApiError(401,message.UNAUTHORIZED_USER))
        }

        next(error)
    }
}