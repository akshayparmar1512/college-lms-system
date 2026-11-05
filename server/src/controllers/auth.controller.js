import { AuthService } from "../services/auth.service.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { message } from "../utils/message.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const authService = new AuthService()

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await authService.findUserByMail(email)

        if (!user) {
            throw new ApiError(404, message.NOT_EXISTS)
        }

        console.log("User:", user)

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new ApiError(401, message.INVALID_CREDENTIALS)
        }

        const payload = {
            sub: user.user_id,
            role: user.role
        }

        const accessToken = jwt.sign(
            { payload: payload },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )

        const refreshToken = jwt.sign(
            { payload: payload },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        )

        const salt = 11
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt)
        const refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 601000)

        const data = {
            userId: user.user_id,
            refreshToken: hashedRefreshToken,
            refreshTokenExpiry: refreshTokenExpiry
        }

        const savedSession = await authService.saveUserSession(data)
        console.log(savedSession)

        const options = {
            httpOnly: true,
            secure: true
        }
        const result = {
            accessToken: accessToken,
            refreshToken: refreshToken

        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
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