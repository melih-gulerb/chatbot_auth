import express from 'express'
import dotenv from 'dotenv'
import { getDBConnection } from './configs/mssql'
import { AuthorizationService } from './services/authorizationService'
import {AuthRepository} from "./repositories/authRepository"
import {AuthorizationController} from "./controllers/authorizationController";
import {AuthenticationController} from "./controllers/authenticationController";
import {AuthenticationService} from "./services/authenticationService";
import {AuthorizationRoutes} from "./routes/authorizationRoutes";
import {AuthenticationRoutes} from "./routes/authenticationRoutes";

dotenv.config()

const app = express()
app.use(express.json())

export async function initialize() {
    try {
        const mssqlConnection = await getDBConnection()
        const authRepository = AuthRepository.getInstance(mssqlConnection)

        const authorizationService = new AuthorizationService(authRepository)
        const authorizationController = new AuthorizationController(authorizationService)

        const authenticationService = new AuthenticationService(process.env.JWT_SECRET || '', '12h', authRepository)
        const authenticationController = new AuthenticationController(authenticationService)

        new AuthorizationRoutes().InitRoutes(app, authorizationController)
        new AuthenticationRoutes().InitRoutes(app, authenticationController)

        const PORT = 4040
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to initialize application:', error)
        process.exit(1)
    }
}
