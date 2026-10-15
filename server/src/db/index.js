import {DataSource} from "typeorm"

 console.log("database url",process.env.DATABASE_URL)

const AppDataSource = new DataSource({
    type:"postgres",
    url:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:true
    },
    entities:[],
    synchronize:false
})

export const connectDB = async ()=>{
    try {
        await AppDataSource.initialize()

        console.log("datasource initialized succesfully")
       
    } catch (error) {
        console.error("database connection error" , error)
        throw error
    }
}