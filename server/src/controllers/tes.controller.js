import { ApiResponse } from "../utils/ApiResponse.js"

export const testRoute = (req,res,next)=>{
    try {
        res.status(200).json(new ApiResponse(200,req.user,"test success"))
    } catch (error) {
        next(error)
    }
}