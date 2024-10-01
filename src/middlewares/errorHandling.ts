import {Request, Response, NextFunction} from 'express'
import {BusinessError} from "../models/errors/base"

function errorHandler(err: BusinessError | Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof BusinessError) {
        const body = {
            status: 'error',
            message: err.message,
        }
        console.log(body)
        return res.status(err.statusCode).json(body)
    }

    const body = {
        status: 'error',
        message: 'Internal Server Error',
    }
    console.log(body)
    res.status(500).json(body)
}

export {errorHandler}
