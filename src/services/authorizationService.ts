import {AuthRepository} from "../repositories/authRepository"
import {BusinessError} from "../models/errors/base"
import jwt from 'jsonwebtoken'

export class AuthorizationService {
    private authRepository: AuthRepository

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository
    }

    public async verifyJWT(token: string): Promise<void> {
        try {
            jwt.verify(token, process.env.JWT_SECRET || '', {algorithms: ['HS256']});

            return;
        } catch (error) {
            console.error('Token verification failed:', (error as Error).message || error);

            if ((error as any).name === 'TokenExpiredError') {
                throw new BusinessError('Token is expired, you need to refresh', 403);
            }

            throw new BusinessError('Invalid token', 401);
        }
    }
}