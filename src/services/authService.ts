import {AuthRepository} from "../repositories/authRepository"
import {AuthResponse, VerifyResponse} from "../models/responses/authResponse"
import {BusinessError} from "../models/errors/base"
import {decrypt, encrypt} from "../helpers/jwt"
import jwt from 'jsonwebtoken'

export class AuthService {
    private authRepository: AuthRepository

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository
    }

    public async createJWT(clientId: string, userId: string): Promise<AuthResponse> {
        const userValidationResponse = await this.authRepository.validateUserSecret(userId)
        if (userValidationResponse.modelId == "") {
            throw new BusinessError("User not found", 404)
        }

        const payload = {
            clientId: clientId,
            modelId: userValidationResponse.modelId,
            expireAt: Math.floor(Date.now() / 1000) + (60 * 60 * 12), // 12 hour expiration
        }

        const encryptedSecret = encrypt(process.env.JWT_SECRET || '')

        const secret = decrypt(encryptedSecret)
        const token = jwt.sign(payload, secret, {algorithm: 'HS256'})

        return {token}
    }

    public async verifyJWT(token: string): Promise<VerifyResponse> {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '')

            if (decoded.expireAt && decoded.expireAt < Math.floor(Date.now() / 1000)) {
                console.log('Token is expired')
                throw new BusinessError('Token is expired, you need to refresh', 403)
            }

            console.log('Token is valid:', decoded)
            return {
                isValid: true,
            }
        } catch (error) {
            console.error('Invalid token:', error)
            throw new BusinessError('Invalid token', 401)
        }
    }
}
