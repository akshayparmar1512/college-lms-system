import { AppDataSource } from "../db/index.js"
import { User } from "../entities/user.entity.js"
import { UserSession } from "../entities/user_sessions.entity.js"

const userRepository = AppDataSource.getRepository(User)
const userSessionRepository = AppDataSource.getRepository(UserSession)

export class AuthService {
    async findUserByMail (useremail){
        console.log(useremail)
        const user = await userRepository.findOne({
            where:{
                email:useremail,
                status:"active"
            }
        })
        return user;
    }

    async saveUserSession (data){

        const sessionData = {
            user_id:data.userId,
            refresh_token:data.refreshToken,
            expires_at:data.refreshTokenExpiry
        }

        const createdUserSession = userSessionRepository.create(sessionData)

        const userSession = await userSessionRepository.save(createdUserSession)
        return userSession
    }
}