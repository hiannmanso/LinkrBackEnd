import db from '../db.js'

async function likePost(user, post) {

    const { rows } = await db.query(`SELECT "quantityLikes" FROM posts WHERE id=$1`, [post]);
    const [likes] = rows;
    db.query(`UPDATE posts SET "quantityLikes"=$1 + 1 WHERE "id"=$2`, [likes.quantityLikes, post]);
    return db.query(`INSERT INTO likes ("userID", "postID") VALUES ($1,$2)`, [user, post]);
}

async function userAlreadyLiked(user, post) {
    return db.query(`SELECT * FROM likes WHERE "userID" = $1 and "postID" = $2`, [user, post]);
}

async function removeLikePost(user, post) {

    const { rows } = await db.query(`SELECT "quantityLikes" FROM posts WHERE id=$1`, [post]);
    const [likes] = rows;
    await db.query(`UPDATE posts SET "quantityLikes"=$1 - 1 WHERE "id"=$2`, [likes.quantityLikes, post]);
    return db.query(`DELETE FROM likes WHERE "userID"=$1 and "postID"=$2`, [user, post]);
}

async function getPublicationTheUserLike() {
    return db.query(`SELECT users.name, likes."postID" 
    FROM likes
    JOIN users ON users.id = likes."userID"`);
}

const likesRepository = {
    likePost,
    removeLikePost,
    userAlreadyLiked,
    getPublicationTheUserLike
};

export default likesRepository;