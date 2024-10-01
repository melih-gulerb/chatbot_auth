import express from 'express'
import dotenv from 'dotenv'
import { getDBConnection } from './configs/mssql'
import { AuthService } from './services/authService'
import { AuthController } from './controllers/authController'
import {AuthRepository} from "./repositories/authRepository";
import {errorHandler} from "./middlewares/errorHandling";

dotenv.config()

const app = express()
app.use(express.json())

export async function initialize() {
    try {
        const mssqlConnection = await getDBConnection()
        const authRepository = AuthRepository.getInstance(mssqlConnection)
        const authService = new AuthService(authRepository)
        const authController = new AuthController(authService)

        const router = express.Router()

        app.use('/auth', router)
        router.use(errorHandler)
        router.post('', (req, res, next) => authController.authenticate(req, res, next))

        const PORT = 4040
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to initialize application:', error)
        process.exit(1)
    }
}
