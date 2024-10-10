import {Request, Response, NextFunction} from 'express'
import {BusinessError} from "../models/errors/base"

async function errorHandler(err: BusinessError | Error, req: Request, res: Response, next: NextFunction) : Promise<void> {
    if (err instanceof BusinessError) {
        const body = {
            message: err.message,
        }
        console.log(body)
        res.status(err.statusCode).json(body)
    } else {
        const body = {
            message: 'Internal Server Error',
        }
        res.status(500).json(body)
    }
}

export {errorHandler}
