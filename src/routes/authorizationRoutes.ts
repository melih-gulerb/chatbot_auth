import express, {Express} from "express";
import {AuthorizationController} from "../controllers/authorizationController";
import {errorHandler} from "../middlewares/errorHandling";

export class AuthorizationRoutes {
    public InitRoutes(app: Express, authorizationController: AuthorizationController) {
        const router = express.Router()
        app.use('/authorization', router)

        router.post('/verify', (req, res, next) => authorizationController.verify(req, res, next))
        router.use(errorHandler)
    }
}