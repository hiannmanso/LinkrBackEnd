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

// export async function removeLike(req, res) {
//     const { postID: post } = req.body;
//     const { token } = res.locals;
//     try {
//         const user = await getUserIdByToken(req, res, token);
//         const { rows } = await likesRepository.removeLikePost(user, post);
//         if (rows === 0) {
//             res.sendStatus(400);
//         }
//         res.sendStatus(200);
//     } catch (err) {
//         console.log("Deu erro na remoção do like", err);
//         return res.sendStatus(500);
//     }
// }
