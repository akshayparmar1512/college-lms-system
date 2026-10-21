import { ApiError } from "../utils/ApiError.js"
import { ErrorsMessage } from "../utils/errors.js"

export const errorHandlerMiddleware = (error, req, res, next) => {
   
    const statusCode = error instanceof ApiError ? error.statusCode : 500

    return res.status(statusCode).json({
        success: false,
        data: null,
        message: statusCode === 500 ? ErrorsMessage.INTERNAL_SERVER_ERROR : error.message,
        erros: error instanceof ApiError ? error.errors : []

    })
}