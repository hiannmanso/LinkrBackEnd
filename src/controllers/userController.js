import usersRepository from '../repositories/usersRepository.js'
import db from '../db.js'
import getUserIdByToken from '../repositories/validSessionRepository.js'

export async function getUser(req, res) {
	const { userID } = req.params
	try {
		const users = await usersRepository.getUserById(userID)
		if (users.rowCount === 0) {
			return res.sendStatus(422)
		}
		res.send(users.rows)
	} catch (error) {
		console.log(error)
		return res.sendStatus(500) // server error
	}
}

export async function createUser(req, res) {
	const user = req.body

	try {
		const existingUsers = await usersRepository.getUserByEmail(user.email)
		if (existingUsers.rowCount > 0) {
			return res.sendStatus(409) // conflict
		}
		const { name, email, picture, password } = user
		await usersRepository.createUser(name, email, picture, password)
		res.sendStatus(201) // created
	} catch (error) {
		console.log(error)
		return res.sendStatus(500) // server error
	}
}

export async function infoUser(req, res) {
	const { token } = res.locals
	console.log(token)
	try {
		const query = `SELECT users.id,users.name,users.picture 
        FROM sessions 
        JOIN users ON sessions."userID"= users.id
        WHERE token = $1`
		const result = await db.query(query, [token])
		if (result.rowCount === 0) return res.status(422).send('Invalid Token')

		res.status(200).send(result.rows)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}
export async function searchUser(req, res) {
	const { userName } = req.params
	const { token } = res.locals;

	console.log(userName)
	try {
		const user = await getUserIdByToken(req, res, token);
		const query = `SELECT users.id,users.name,users.picture 
		FROM users 
		JOIN followers f ON f.following=users.id
		WHERE name ILIKE $1 and f.following=$2
		UNION
		SELECT users.id,users.name,users.picture 
		FROM users
		WHERE name ILIKE $1`
		const result = await db.query(query, [`%${userName}%`, user])

		res.status(200).send(result.rows)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}
