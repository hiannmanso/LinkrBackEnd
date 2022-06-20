import db from '../db.js'

async function editPost(id, description) {
	return db.query(`UPDATE posts SET description=$1 WHERE id=$2`, [
		description,
		id,
	])
}

async function getPublicationOwner(postID) {
	return db.query(`SELECT id, "userID" FROM posts WHERE id=$1`, [postID])
}

const postRepository = {
	editPost,
	getPublicationOwner,
}

export default postRepository
