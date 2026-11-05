import express from "express"
import cors from "cors"
import { route } from "./routes/index.route.js"
import { errorHandlerMiddleware } from "./middlewares/errorhandler.middleware.js"
import cookieParser from "cookie-parser"
const app = express()


// middleware for allow request from only allowed origin
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

// middleware for parse json data from incoming request
app.use(express.json({limit:"10kb"}))

// middleware for parse incoming cookies and send cookie
app.use(cookieParser())

app.use("/api/v1",route)

// central error handler middleware
app.use(errorHandlerMiddleware)


export default app
