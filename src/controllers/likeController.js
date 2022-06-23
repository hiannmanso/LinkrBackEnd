import likesRepository from '../repositories/likeRepository.js'
import getUserIdByToken from '../repositories/validSessionRepository.js'

export async function setLike(req, res) {
	const { postID: post } = req.body
	const { token } = res.locals
	try {
		const user = await getUserIdByToken(req, res, token)
		const likes = await likesRepository.userAlreadyLiked(user, post)
		if (likes.rows[0]) {
			await likesRepository.removeLikePost(user, post)
			return res.sendStatus(200)
		}
		await likesRepository.likePost(user, post)
		res.sendStatus(200)
	} catch (err) {
		console.log('Deu erro em adicionar like', err)
		res.sendStatus(500)
	}
}

export async function getUsersWhoLiked(req, res) {
	try {
		const { rows } = await likesRepository.getPublicationTheUserLike();
		res.send(rows);
	} catch (err) {
		console.log("Error in getUsersWhoLiked", err);
		res.sendStatus(500);
	}
}

export async function getUsersLikedOnPost(req, res) {
	const { id } = req.params;
	if (!id) {
		return res.sendStatus(400);
	}
	try {
		const { rows } = await likesRepository.getUsersLikesOnPost(id);
		res.send(rows);
	} catch (err) {
		console.log("Error in get users liked on post", err);
		res.sendStatus(500);
	}
}