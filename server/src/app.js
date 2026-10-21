import express from "express"
import cors from "cors"
import { upload } from "./middlewares/multer.middleware.js"
import { route } from "./routes/index.route.js"
import { errorHandlerMiddleware } from "./middlewares/errorhandler.middleware.js"
const app = express()


// middleware for allow request from only allowed origin
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

// middleware for parse json data from incoming request
app.use(express.json({limit:"10kb"}))

app.use("/api/v1",route)

// central error handler middleware
app.use(errorHandlerMiddleware)


export default app
