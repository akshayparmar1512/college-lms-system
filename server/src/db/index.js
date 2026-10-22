import {DataSource} from "typeorm"
import { College } from "../entities/College.entity.js"
import { User } from "../entities/user.entity.js"

 console.log("database url",process.env.DATABASE_URL)


//  create datasource that holds our database connection settings and pools
export const AppDataSource = new DataSource({
    type:"postgres",
    url:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:true
    },
    // host:process.env.DB_HOST,
    // port:process.env.DB_PORT,
    // username:process.env.DB_USERNAME,
    // password:process.env.DB_PASSWORD,
    // database:process.env.DB_NAME,
    entities:[College,User],
    synchronize:true,
    logging:false
})

export const connectDB = async ()=>{
    try {
        console.time("Database initialization")
        await AppDataSource.initialize()
        console.timeEnd("Database initialization");
        console.log("datasource initialized succesfully")
       
    } catch (error) {
        console.error("database connection error" , error)
        throw error
    }
}