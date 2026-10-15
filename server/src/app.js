import express from "express"
import cors from "cors"
const app = express()


// middleware for allow request from only allowed origin
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

// middleware for parse json data from incoming request
app.use(express.json({limit:"10kb"}))

export default app
