import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const sqlConfig: sql.config = {
    user: process.env.MSSQL_USER || '',
    password: process.env.MSSQL_PASSWORD || '',
    database: process.env.MSSQL_DATABASE || '',
    server: process.env.MSSQL_SERVER || '',
    port: parseInt(process.env.MSSQL_PORT || '1433'),
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true, // For self-signed certificates
    },
}

let pool: sql.ConnectionPool

export async function getDBConnection(): Promise<sql.ConnectionPool> {
    if (pool) {
        return pool
    }

    try {
        pool = await sql.connect(sqlConfig)
        console.log('MSSQL connected successfully.')
        return pool
    } catch (error) {
        console.error('Error connecting to MSSQL:', error)
        throw error
    }
}
