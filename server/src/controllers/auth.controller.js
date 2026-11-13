import { AuthService } from "../services/auth.service.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from "bcrypt"
import { message } from "../utils/message.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import crypto from "node:crypto"
import { sendForgotPasswordOtpMail } from "../utils/nodemailer.js"


const authService = new AuthService()

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await authService.findUserByMail(email)

        if (!user) {
            throw new ApiError(401, message.INVALID_CREDENTIALS)
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new ApiError(401, message.INVALID_CREDENTIALS)
        }

        const accessTokenPayload = {
            user_id: user.user_id,
            college_id: user.college_id,
            name: user.full_name,
            role: user.role
        }

        const refreshTokenPayload = {
            user_id: user.user_id,
            college_id: user.college_id,
        }

        const accessToken = authService.generateAccessToken(accessTokenPayload)

        const refreshToken = authService.generateRefreshToken(refreshTokenPayload)

        const refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        const userAgent = req.headers["user-agent"] || "Unknown Device"
        const ipAddress = req.ip

        const data = {
            userId: user.user_id,
            collegeId: user.college_id,
            refreshToken: refreshToken,
            refreshTokenExpiry: refreshTokenExpiry,
            userAgent: userAgent,
            ipAddress: ipAddress

        }

        const savedSession = await authService.saveUserSession(data)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("refresh_token", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    accessToken,
                    message.SUCCESFUL_LOGIN
                )
            )

    } catch (error) {
        console.log("error in login:", error)
        next(error)
    }
}

export const generateNewRefreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refresh_token

        if (!refreshToken) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const decodeRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const storedToken = await authService.findByTokenAndUserId(refreshToken, decodeRefreshToken.user_id, decodeRefreshToken.college_id)

        if (!storedToken) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const user = await authService.findUserById(decodeRefreshToken.user_id, decodeRefreshToken.college_id)

        if (!user) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const accessTokenPayload = {
            user_id: user.user_id,
            college_id: user.college_id,
            name: user.full_name,
            role: user.role
        }

        const refreshTokenPayload = {
            user_id: user.user_id,
            college_id: user.college_id,
        }

        const newAccessToken = authService.generateAccessToken(accessTokenPayload)


        const isRevoked = await authService.revokeOldRefreshToken(refreshToken, decodeRefreshToken.user_id, decodeRefreshToken.college_id)

        if (!isRevoked) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const newRefreshToken = authService.generateRefreshToken(refreshTokenPayload)

        const refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        const userAgent = req.headers["user-agent"] || "Unknown Device"
        const ipAddress = req.ip

        const data = {
            userId: user.user_id,
            collegeId: user.college_id,
            refreshToken: newRefreshToken,
            refreshTokenExpiry: refreshTokenExpiry,
            userAgent: userAgent,
            ipAddress: ipAddress

        }

        const savedSession = await authService.saveUserSession(data)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .cookie("refresh_token", newRefreshToken, options)
            .json(
                new ApiResponse(200, newAccessToken, "Token Refreshed Succesfully")
            )

    } catch (error) {
        console.log("refresh token controller:", error)
        next(error)
    }
}


export const logout = async (req, res, next) => {
    try {

        const refreshToken = req.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const user = req.user

        await authService.revokeOldRefreshToken(refreshToken, user.user_id, user.college_id)

        return res
            .clearCookie("refresh_token")
            .json(
                new ApiResponse(200, message.SUCCESFUL_LOGOUT)
            )

    } catch (error) {
        console.log("Error In Logout Controller:", error)
        next(error)
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        const user = await authService.findUserWithCollege(email)
        console.log("user:", user)
        if (!user) {
            throw new ApiError(404, message.COMMON_EMAIL_MSG)
        }

        const otp = crypto.randomInt(100000, 1000000).toString()
        const expireTime = new Date(Date.now() + 5 * 60 * 1000)
        const salt = 11
        const hashOTP = await bcrypt.hash(otp, salt)


        const savedOtp = await authService.saveOtp(user.user_id, hashOTP, expireTime)

        try {
            await sendForgotPasswordOtpMail(
                user.full_name,
                user.college.name,
                email,
                otp
            )
        } catch (error) {
            console.log("error in otp mail sending", error)
            await authService.deleteOtp(savedOtp.otp_id)
            throw error
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, user.user_id, message.COMMON_EMAIL_MSG)
            )

    } catch (error) {
        console.log("error in forgot password:", error)
        next(error)
    }
}

export const verifyOtp = async (req, res, next) => {
    try {
        const { otp, userId } = req.body

        const otpRecord = await authService.incrementOtpAttempt(userId)

        if (!otpRecord) {
            throw new ApiError(404, "Please Enter Valid OTP")
        }

        if (otpRecord.attempts > 3) {
            throw new ApiError(410, "Maximum Attempt Reached")
        }

        if (Date.now() >= new Date(otpRecord.expires_at)) {
            throw new ApiError(410, "otp Expired")
        }

        if (otpRecord.is_verified === true || otpRecord.is_deleted === true) {
            throw new ApiError(410, "otp already verified")
        }

        const isVerify = await bcrypt.compare(otp, otpRecord.otp_hash)

        if (!isVerify) {
            throw new ApiError(400, "Please Enter Valid otp")
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
        const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000)

        const result = await authService.saveResetTokenAndMarkVerify(otpRecord.otp_id,userId,tokenHash,tokenExpiry)

        if (!result) {
            throw new ApiError(400, "OTP already used")
        }

        return res.status(200).json(new ApiResponse(200, resetToken, "Otp verify succesfully"))

    } catch (error) {
        console.log("error in otp verify:", error)
        next(error)
    }
}

export const resetPassword = async (req,res,next) => {
    try {
        const {token,newPassword} = req.body

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

        const resetToken = await authService.findByResetToken(tokenHash)

        
        if(!resetToken){
            throw new ApiError(404,"Invalid or Expired Request")
        }

        if(Date.now() >= new Date(resetToken.expires_at)){
            throw new ApiError(410,"Invalid or Expired Request")
        }

        if(!(tokenHash === resetToken.token_hash)){
            throw new ApiError(400,"Invalid or Expired Request")
        }

        const salt = 11
        const passwordHash = await bcrypt.hash(newPassword,salt)

       const result = await authService.changePasswordAndMarkUsedTokenAndDeleteSession(resetToken.user_id,passwordHash,tokenHash) 
        
       return res.status(200).json(
        new ApiResponse(200,null,"Password Changed Succesfully")
       )

    } catch (error) {
        console.log("Error in Reset Password:",error)
        next(error)
    }
}