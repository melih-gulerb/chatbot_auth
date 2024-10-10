import { NextFunction, Request, Response } from 'express';
import {AuthorizationService} from "../services/authorizationService";

export class AuthorizationController {
    private authService: AuthorizationService;

    constructor(authService: AuthorizationService) {
        this.authService = authService;
        this.verify = this.verify.bind(this);
    }

    public async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token } = req.body;

            await this.authService.verifyJWT(token);

            res.status(200).json({ isValid: true });
        } catch (err) {
            next(err);
        }
    }
}