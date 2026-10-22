import { AppDataSource } from "../db/index.js"
import { College } from "../entities/College.entity.js"
import { User } from "../entities/user.entity.js"
import { ApiError } from "../utils/ApiError.js"

const collegeRepository = AppDataSource.getRepository(College)
const userRepository = AppDataSource.getRepository(User)

export class SuperAdminService {
    async registerCollegeAndAdmin(data) {
        let savedCollege;

        try {

            const collegeData = {
                name: data.collegeName,
                aicte_id: data.aicteId,
                slug: data.collegeSlug,
                logo_url: data.logourl
            };

            const createdCollege = collegeRepository.create(collegeData);
            savedCollege = await collegeRepository.save(createdCollege);

            const adminData = {
                college: { college_id: savedCollege.college_id },
                full_name: data.adminName,
                email: data.adminEmail,
                password: data.hashPassword,
                role: "admin"
            };

            const createdAdmin = userRepository.create(adminData);
            const savedAdmin = await userRepository.save(createdAdmin);

            return { college: savedCollege, admin: savedAdmin };

        } catch (error) {

            if (savedCollege && savedCollege.college_id) {
                console.log("Admin creation failed. Deleting orphan college...");
                await collegeRepository.delete(savedCollege.college_id);
            }


            if (error.code === "23505") {
                throw new ApiError(409, "Admin with this email already exists");
            }
            throw error;
        }
    }
}
