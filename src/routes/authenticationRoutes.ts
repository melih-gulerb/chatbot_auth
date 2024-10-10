import express, {Express} from "express";
import {errorHandler} from "../middlewares/errorHandling";
import {AuthenticationController} from "../controllers/authenticationController";

export class AuthenticationRoutes {
    public InitRoutes(app: Express, authorizationController: AuthenticationController) {
        const router = express.Router()
        app.use('/authentication', router)

        router.post('/signup', (req, res, next) => authorizationController.signup(req, res, next))
        router.post('/login', (req, res, next) => authorizationController.login(req, res, next))
        router.use(errorHandler)
    }
}