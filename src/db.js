import pg from 'pg'
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config()

const { Pool } = pg

const databaseConfig = {
	connectionString: process.env.DATABASE_URL,
}

if (process.env.MODE === 'PROD') {
	configDatabase.ssl = {
		rejectUnauthorized: false,
	}
}
console.log(chalk.bold.blue(`Connected to Postgres database`))
const db = new Pool(databaseConfig)

export default db
