import { AppDataSource } from "../db/index.js"
import { User } from "../entities/user.entity.js"
import { UserSession } from "../entities/user_sessions.entity.js"
import jwt from "jsonwebtoken"

const userRepository = AppDataSource.getRepository(User)
const userSessionRepository = AppDataSource.getRepository(UserSession)

export class AuthService {
    async findUserByMail(useremail) {
        console.log(useremail)
        const user = await userRepository.findOne({
            where: {
                email: useremail,
                status: "active"
            }
        })
        return user;
    }

    generateAccessToken(data) {
        const payload = {
            user_id:data.user_id,
            college_id:data.college_id,
            name: data.full_name,
            role: data.role
        }

        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
        return accessToken;
    }

    generateRefreshToken(data){
        const payload = {
            user_id:data.user_id,
            college_id:data.college_id
        }

        const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
        return refreshToken;
    }

    async saveUserSession(data) {

        const sessionData = {
            user_id: data.userId,
            college_id:data.collegeId,
            refresh_token: data.refreshToken,
            expires_at: data.refreshTokenExpiry,
            user_agent:data.userAgent,
            ip_address:data.ipAddress
        }

        const createdUserSession = userSessionRepository.create(sessionData)

        const userSession = await userSessionRepository.save(createdUserSession)
        return userSession
    }

    async findByTokenAndUserId(token,userId){

        const storedToken = await userSessionRepository.findOne({
            where:{
                refresh_token:token,
                user_id:userId
            }
        })

        return storedToken
    }

    async findUserById(userId,collegeId){
        const user = await userRepository.findOne({
            where:{
                user_id:userId,
                college_id:collegeId
            }
        })

        return user
    }

    async revokeOldRefreshToken(token,userId,collegeId){
        const updatedToken = await userSessionRepository.update(
            {
                refresh_token:token,
                user_id:userId,
                college_id:collegeId
            },
            {
                is_revoked:true,
                revoked_at:new Date()
            }
        )
        return updatedToken
    }
}