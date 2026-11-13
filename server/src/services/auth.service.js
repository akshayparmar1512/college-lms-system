import { AppDataSource } from "../db/index.js"
import { PasswordResetOtp } from "../entities/password_reset_otp.entity.js"
import { PasswordResetToken } from "../entities/password_reset_token.entity.js"
import { User } from "../entities/user.entity.js"
import { UserSession } from "../entities/user_sessions.entity.js"
import jwt from "jsonwebtoken"

const userRepository = AppDataSource.getRepository(User)
const userSessionRepository = AppDataSource.getRepository(UserSession)
const passwordResetOtpRepository = AppDataSource.getRepository(PasswordResetOtp)
const passwordResetToken = AppDataSource.getRepository(PasswordResetToken)

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
            user_id: data.user_id,
            college_id: data.college_id,
            name: data.full_name,
            role: data.role
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
        return accessToken;
    }

    generateRefreshToken(data) {
        const payload = {
            user_id: data.user_id,
            college_id: data.college_id
        }

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
        return refreshToken;
    }

    async saveUserSession(data) {

        const sessionData = {
            user_id: data.userId,
            college_id: data.collegeId,
            refresh_token: data.refreshToken,
            expires_at: data.refreshTokenExpiry,
            user_agent: data.userAgent,
            ip_address: data.ipAddress
        }

        const createdUserSession = userSessionRepository.create(sessionData)

        const userSession = await userSessionRepository.save(createdUserSession)
        return userSession
    }

    async findByTokenAndUserId(token, userId, collegeId) {

        const storedToken = await userSessionRepository.findOne({
            where: {
                refresh_token: token,
                user_id: userId,
                college_id: collegeId,
                is_revoked: false
            }
        })

        return storedToken
    }

    async findUserById(userId, collegeId) {
        const user = await userRepository.findOne({
            where: {
                user_id: userId,
                college_id: collegeId
            }
        })

        return user
    }

    async revokeOldRefreshToken(token, userId, collegeId) {
        const updatedToken = await userSessionRepository.update(
            {
                refresh_token: token,
                user_id: userId,
                college_id: collegeId
            },
            {
                is_revoked: true,
                revoked_at: new Date()
            }
        )
        return updatedToken.affected > 0
    }

    async findUserWithCollege(useremail) {
        const userwithcollege = await userRepository.findOne({
            where: {
                email: useremail,
                status: "active"
            },
            relations: {
                college: true
            }
        })
        return userwithcollege
    }

    async saveOtp(userId, hashOTP, expireTime) {
        const data = {
            user_id: userId,
            otp_hash: hashOTP,
            expires_at: expireTime
        }

        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.update(
                PasswordResetOtp,
                {
                    user_id: userId,
                    is_verified: false,
                    is_deleted: false
                },
                {
                    is_deleted: true
                }
            )

            const createdOtpRecord = transactionalEntityManager.create(PasswordResetOtp, data)
            return transactionalEntityManager.save(PasswordResetOtp, createdOtpRecord)
        })
    }

    async deleteOtp(otpId) {
        return await passwordResetOtpRepository.delete(otpId)
    }

    async incrementOtpAttempt(userId) {
        const result = await passwordResetOtpRepository
            .createQueryBuilder()
            .update(PasswordResetOtp)
            .set({ attempts: () => "attempts + 1" })
            .where("user_id = :userId AND is_verified = false AND is_deleted = false", { userId })
            .returning('*')
            .execute()
        return result.raw[0]
    }

    async saveResetTokenAndMarkVerify(otpId, userId, resetToken, expireTime) {

        const data = {
            user_id: userId,
            token_hash: resetToken,
            expires_at: expireTime
        }

        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.update(
                PasswordResetOtp,
                {
                    otp_id: otpId,
                    is_deleted: false,
                    is_verified: false
                },
                {
                    is_verified: true
                }
            )

            await transactionalEntityManager.update(
                PasswordResetToken,
                {
                    user_id: userId,
                    is_used: false,
                    is_deleted: false
                },
                {
                    is_deleted: true
                }
            )

            const obj = transactionalEntityManager.create(PasswordResetToken, data)
            return transactionalEntityManager.save(PasswordResetToken, obj)
        })

    }

    async findByResetToken (token) {
        const result = await passwordResetToken.findOne({
            where:{
                token_hash:token,
                is_used:false,
                is_deleted:false
            }
        })

        return result
    }

    async changePasswordAndMarkUsedTokenAndDeleteSession(userId,password,token){
       return await AppDataSource.transaction(async (transactionalEntityManager) => {
             await transactionalEntityManager.update(
                User,
                {
                    user_id:userId,
                    status:"active"
                },
                {
                    password:password
                }
            )
            await transactionalEntityManager.update(
                PasswordResetToken,
                {
                    token_hash:token,
                    is_used:false,
                    is_deleted:false
                },
                {
                    is_used:true
                }
            )

            await transactionalEntityManager.update(
                UserSession,
                {
                    user_id:userId,
                    is_revoked:false
                },
                {
                    is_revoked:true
                }
            )
        })

    }
}