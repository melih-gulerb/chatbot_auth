import { NextFunction, Request, Response } from 'express';
import {AuthenticationService} from "../services/authenticationService";

export class AuthenticationController {
    private authService: AuthenticationService;

    constructor(authService: AuthenticationService) {
        this.authService = authService;
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
    }

    public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const token = await this.authService.registerUser(email, password);

            res.status(201).json({ token: token });
        } catch (err) {
            next(err);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const token = await this.authService.authenticateUser(email, password);

            res.status(200).json({ token: token });
        } catch (err) {
            next(err);
        }
    }
}