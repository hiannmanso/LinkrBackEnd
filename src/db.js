import pg from 'pg'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config()

const { Pool } = pg
const configDatabase = {
	connectionString: process.env.DATABASE_URL,
	ssl:true,
}

if (process.env.MODE === 'PROD') {
	configDatabase.ssl = {
		rejectUnauthorized: false,
	}
}

const db = new Pool(configDatabase)
console.log(chalk.bold.blue('Postgres database connected.'))
export default db
