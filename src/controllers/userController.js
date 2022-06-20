import usersRepository from '../repositories/usersRepository.js'
import db from '../db.js'
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
