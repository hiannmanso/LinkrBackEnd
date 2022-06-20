import db from '../db.js'

export default async function getUserIdByToken(req, res, token) {
	try {
		const query = `SELECT * FROM sessions WHERE token = $1`
		const result = await db.query(query, [token])
		// console.log(result)
		if (result.rowCount === 0) return res.status(422).send('Invalid Token')
		return result.rows[0].userID
	} catch (error) {
		console.log(error)
	}
}
