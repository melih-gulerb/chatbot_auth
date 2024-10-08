import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const sqlConfig: sql.config = {
    user: process.env.MSSQL_USER || '',
    password: process.env.MSSQL_PASSWORD || '',
    database: process.env.MSSQL_DATABASE || '',
    server: process.env.MSSQL_SERVER || '',
    port: parseInt(process.env.MSSQL_PORT || '1433'),
    pool: {
        idleTimeoutMillis: 150000
    },
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
        keepConnectionAlive(pool)
        return pool
    } catch (error) {
        console.error('Error connecting to MSSQL:', error)
        throw error
    }
}

async function keepConnectionAlive(pool: any) {
    let notBreak = true
    while (notBreak) {  // Loop indefinitely for keep-alive
        try {
            // Wait for the connection pool to be available
            if (pool) {
                await pool.request().query('SELECT 1');
                console.log('Ping sent to Azure SQL to keep the connection alive.');
            }
        } catch (err) {
            console.error('Error during ping query:', err);
            notBreak = false
        }

        // Wait for a certain interval before sending the next ping
        await new Promise(resolve => setTimeout(resolve, 15 * 60 * 1000));  // Ping every 15 minutes
    }
}
