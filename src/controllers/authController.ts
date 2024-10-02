import {NextFunction, Request, Response} from 'express'
import { AuthService } from '../services/authService'

export class AuthController {
    private authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }
    public async createJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { clientId, userId } = req.body

            const token = await this.authService.createJWT(clientId, userId)

            res.status(200).json(token)
            return
        } catch (err){
            next(err)
        }
    }

    public async verifyJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { token } = req.body
            const isValid = await this.authService.verifyJWT(token)

            res.status(200).json(isValid)
            return
        } catch (err) {
            next(err)
        }
    }
}
