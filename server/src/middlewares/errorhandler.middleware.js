import { ApiError } from "../utils/ApiError.js"
import { message } from "../utils/message.js"

export const errorHandlerMiddleware = (error, req, res, next) => {
   
    const statusCode = error instanceof ApiError ? error.statusCode : 500

    return res.status(statusCode).json({
        success: false,
        data: null,
        message: statusCode === 500 ? message.INTERNAL_SERVER_ERROR : error.message,
        erros: error instanceof ApiError ? error.errors : []

    })
}