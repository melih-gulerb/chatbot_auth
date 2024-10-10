import jwt from 'jsonwebtoken';
import {AuthRepository} from "../repositories/authRepository";
import {AuthenticationValidator} from "../validators/authenticationValidator";

export class AuthenticationService {
    private authRepository: AuthRepository
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;

    constructor(jwtSecret: string, jwtExpiresIn: string = '12h', authRepository: AuthRepository) {
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
        this.authRepository = authRepository
    }

    public async registerUser(email: string, password: string): Promise<string> {
        let validation = AuthenticationValidator.ValidateRegisterUser(email, password)
        if (validation.error !== null) {
            throw validation.error
        }


        let repository = await this.authRepository.registerUser(email, password);
        if (repository.error != null) {
            throw repository.error;
        }

        return this.createJWT(repository.userId);
    }

    public async authenticateUser(email: string, password: string): Promise<string | null> {
        const {error, userId} = await this.authRepository.authenticateUser(email, password);
        if (error != null) {
            throw error
        }

        return this.createJWT(userId);
    }

    public async createJWT(userId: string): Promise<string> {
        return jwt.sign({userId}, this.jwtSecret, {expiresIn: this.jwtExpiresIn, algorithm: "HS256"});
    }
}