import express, {Express} from "express";
import {AuthorizationController} from "../controllers/authorizationController";

export class AuthorizationRoutes {
    public InitRoutes(app: Express, authorizationController: AuthorizationController) {
        app.post('/verify', authorizationController.verify)
    }
}