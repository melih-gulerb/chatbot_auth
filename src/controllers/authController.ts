import {NextFunction, Request, Response} from 'express'
import { AuthService } from '../services/authService'
import {AuthResponse} from "../models/responses/authResponse";

export class AuthController {
    private authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }
    public async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { clientId, userId } = req.body

            const token = await this.authService.createJWT(clientId, userId)

            res.status(200).json(token)
            return
        } catch {
            next()
        }
    }
}
