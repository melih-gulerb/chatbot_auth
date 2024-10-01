import sql, {ConnectionPool} from "mssql"
import {BusinessError} from "../models/errors/base"
import {ValidateUserSecretResponse} from "../models/repository/response";

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

    public async validateUserSecret(userId: string): Promise<ValidateUserSecretResponse> {
        try {
            const result = await this.dbConnection.request()
                .input('Id', sql.UniqueIdentifier, userId)
                .query(`SELECT ModelId as modelId FROM chatbot.Users WHERE Id = @Id`)

            return {
                modelId: result.recordset[0] == null ? "" : result.recordset[0].modelId
            }
        } catch (error) {
            console.error('Database query error:', error);
            throw new BusinessError(error as string, 500);
        }
    }
}