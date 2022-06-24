import db from '../db.js'
import followRepository from '../repositories/followRepository.js'
import getUserIdByToken from '../repositories/validSessionRepository.js'

export async function createFollow(req, res) {
	const { followed } = req.body
	const { token } = res.locals
	try {
		const user = await getUserIdByToken(req, res, token)
		console.log(followed, user, token)
		const { rows } = await followRepository.verifyFollow(user, followed)
		const [row] = rows
		console.log(row)
		if (row) {
			await followRepository.unfollow(user, followed)
			return res.sendStatus(200)
		}
		await followRepository.follow(user, followed)
		res.sendStatus(200)
	} catch (err) {
		console.log('Error in follow', err)
		res.sendStatus(500)
	}
}

export async function usersIFollow(req, res) {
	const { token } = res.locals
	try {
		const user = await getUserIdByToken(req, res, token)
		const { rows } = await followRepository.getUsersIFollow(user)
		res.send(rows)
	} catch (err) {
		console.log("Error in get users i'm following", err)
		res.sendStatus(500)
	}
}

export async function showUsersFollowed(req, res) {
	const { userID } = req.params

	try {
		const query = `SELECT * 
        FROM followers
        WHERE following = $1`
		const result = await db.query(query, [userID])

		res.status(200).send(result.rows)
	} catch (error) {
		res.status(400).send(error)
	}
}
