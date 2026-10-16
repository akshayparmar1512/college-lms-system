import express from "express"
import cors from "cors"
import { upload } from "./middlewares/multer.middleware.js"
const app = express()


// middleware for allow request from only allowed origin
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))

// middleware for parse json data from incoming request
app.use(express.json({limit:"10kb"}))

app.post("/uploads",upload.single("my-file"),(req,res)=>{
    try {
        if(!req.file){
            res.status(400).json({
                message:"no any file uploaded"
            })
        }else{
            res.status(200).json({
                message:"file uploaded succesfully",
                file_details:req.file
            })
        }
    } catch (error) {
        console.log("FILE UPLOAD ERROR",error)
    }
})

export default app
