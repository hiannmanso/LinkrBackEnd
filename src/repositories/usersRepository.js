import bcrypt from 'bcrypt'
import db from '../db.js'

async function getUserByEmail(email) {
	return db.query(`SELECT * FROM users WHERE email=$1`, [email])
}

async function getUserById(id) {
	return db.query(`SELECT id, name, picture FROM users WHERE id=$1`, [id])
}

async function createUser(name, email, picture, plainPassword) {
	const SALT = 10
	const passwordHash = bcrypt.hashSync(plainPassword, SALT)
	return db.query(
		`
	  INSERT INTO users (name, picture, email, password) 
	  VALUES ($1, $2, $3, $4)`,
		[name, picture, email, passwordHash]
	)
}

const usersRepository = {
	getUserByEmail,
	getUserById,
	createUser,
}

export default usersRepository
