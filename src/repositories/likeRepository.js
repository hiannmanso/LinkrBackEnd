import db from '../db.js'

async function likePost(user, post) {
    return db.query(`INSERT INTO likes ("userID", "postID") VALUES ($1,$2)`, [user, post]);
}

async function removeLikePost(user, post) {
    return db.query(`DELETE FROM likes WHERE "userID"=$1 and "postID"=$2`, [user, post]);
}

const likesRepository = {
    likePost,
    removeLikePost
};

export default likesRepository;