import sql, {ConnectionPool} from "mssql"
import {BusinessError} from "../models/errors/base"
import {v4 as uuidv4} from "uuid"
import bcrypt from "bcryptjs";
import {User} from "../models/user";
import {AuthQueries} from "./queries/authQueries";

export class AuthRepository {
    private static instance: AuthRepository | null = null
    private dbConnection: ConnectionPool
    private constructor(connection: ConnectionPool) {
        this.dbConnection = connection
    }

    public static getInstance(connection: ConnectionPool): AuthRepository {
        if (!AuthRepository.instance) {
            AuthRepository.instance = new AuthRepository(connection)
        }
        return AuthRepository.instance
    }
    public async registerUser(email: string, password: string): Promise<{error : BusinessError | null, userId: string}> {
        try {
            const query = AuthQueries.RegisterUserQuery
            const userId = uuidv4().toString().toLowerCase()
            const passwordHash = await bcrypt.hash(password, 10)

            await this.dbConnection.request()
                .input('Id', sql.VarChar, userId)
                .input('Email', sql.VarChar, email)
                .input('Password', sql.VarChar, passwordHash)
                .query(query);

            return {error: null, userId: userId};
        } catch (error: any) {
            console.error('Error while registering user:', error);

            // Check if the error is due to a unique constraint violation
            if (error.code === 'EREQUEST' && error.originalError && error.originalError.message.includes('UNIQUE')) {
                return {error: new BusinessError('Email already exists', 400), userId: ""};
            }

            return {error: new BusinessError('Failed to register user', 500), userId: ""};
        }
    }

    public async authenticateUser(email: string, password: string): Promise<{error: BusinessError | null, userId: string}> {
        try {
            const query = AuthQueries.AuthenticateUserQuery;
            const result = await this.dbConnection.request()
                .input('Email', sql.VarChar, email)
                .query(query);

            if (result.recordset.length === 0) {
                return {error: new BusinessError('Email not found', 404), userId: ""};
            }

            const user = result.recordset[0] as User;

            const isPasswordValid = await bcrypt.compare(password, user.Password);

            if (!isPasswordValid) {
                return {error: new BusinessError('Password is incorrect', 400), userId: ""};
            }

            return {error: null, userId: user.Id};

        } catch (error) {
            console.error('Error while authenticating user:', error);

            return {error: new BusinessError('Failed to authenticate user', 500), userId: ""};
        }
    }
}