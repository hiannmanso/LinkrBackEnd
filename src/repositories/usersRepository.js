import bcrypt from 'bcrypt'
import db from '../db.js'

async function getUserByEmail(email) {
	return db.query(`SELECT * FROM users WHERE email=$1`, [email])
}

const usersRepository = {
	getUserByEmail,
}

export default usersRepository
