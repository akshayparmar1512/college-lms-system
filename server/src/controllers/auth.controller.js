import { AuthService } from "../services/auth.service.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from "bcrypt"
import { message } from "../utils/message.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const authService = new AuthService()

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await authService.findUserByMail(email)

        if (!user) {
            throw new ApiError(404, message.NOT_EXISTS)
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
            .cookie("access_token", accessToken, options)
            .cookie("refresh_token", refreshToken, options)
            .json(
                new ApiResponse(
                    200, { accessToken, refreshToken }, message.SUCCESFUL_LOGIN
                )
            )

    } catch (error) {
        console.log("error in login:", error)
        next(error)
    }
}

export const generateNewRefreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const decodeRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (!decodeRefreshToken) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const storedToken = await authService.findByTokenAndUserId(refreshToken, decodeRefreshToken.user_id)

        if (!storedToken) {
            throw new ApiError(401, message.UNAUTHORIZED_USER)
        }

        const user = await authService.findUserById(decodeRefreshToken.user_id, decodeRefreshToken.college_id)

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


        const isRevoked = await authService.revokeOldRefreshToken(refreshToken,decodeRefreshToken.user_id,decodeRefreshToken.college_id)

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
            .cookie("access_token", newAccessToken)
            .cookie("refresh_token", newRefreshToken)
            .json(
                new ApiResponse(200,newAccessToken,"Token Refreshed Succesfully")
            )

    } catch (error) {
        console.log("refresh token controller:", error)
        next(error)
    }
}