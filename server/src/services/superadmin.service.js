import { AppDataSource } from "../db/index.js"
import { CollegeSchema } from "../entities/College.entity.js"

const collegeRepository  = AppDataSource.getRepository(CollegeSchema)

export class SuperAdminService {
    async registerCollege(college){
     
        const collegeData = {
            name:college.name,
            aicte_id:college.aicteId,
            slug:college.slug,
            logo_url:college.logourl
        }
      

       const createdCollege = collegeRepository.create(collegeData)
       return await collegeRepository.save(createdCollege)
    }
}