import "dotenv/config";
// import dotenv from "dotenv"
// dotenv.config()
console.log("ENV loaded:", Boolean(process.env.DATABASE_URL));
import { connectDB } from "./db/index.js"
import app from "./app.js"


const startServer = async()=>{
    try {
        
        const port = process.env.PORT || 5000

        console.time("db connect")
        await connectDB()
        console.timeEnd("db connect")
        
        console.time("Server listen");
        app.listen(port, ()=>{
            console.timeEnd("Server listen");
            console.log(`server listen on port ${port}`)
        })
    } catch (error) {
        console.log("connection error ",error)
        process.exit(1)
    }
}

startServer()