import likesRepository from '../repositories/likeRepository.js';

export async function addLike(req, res) {
    const { postID: post } = req.body;
    const { token } = res.locals;
    const user = await getUserIdByToken(req, res, token);
    try {
        await likesRepository.likePost(user, post);
        res.sendStatus(200);
    } catch (err) {
        console.log("Deu erro em adicionar like", err);
        res.sendStatus(500);
    }
}

export async function removeLike(req, res) {
    const { postID: post } = req.body;
    const { token } = res.locals;
    const user = await getUserIdByToken(req, res, token);
    try {
        await likesRepository.removeLikePost(user, post);
        res.sendStatus(200);
    } catch (err) {
        console.log("Deu erro na remoção do like", err);
        return res.sendStatus(500);
    }
}