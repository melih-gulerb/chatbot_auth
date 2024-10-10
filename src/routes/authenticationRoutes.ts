import express, {Express} from "express";
import {AuthenticationController} from "../controllers/authenticationController";

export class AuthenticationRoutes {
    public InitRoutes(app: Express, authenticationController: AuthenticationController) {

        app.post('/authentication/signup',authenticationController.signup)
        app.post('/authentication/login',authenticationController.login)
    }
}