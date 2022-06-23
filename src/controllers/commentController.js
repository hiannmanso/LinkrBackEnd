import db from '../db.js'

export async function commentPOST(req, res) {
	const { postID, userID, text } = req.body
	try {
		const query = `INSERT INTO comments ("postID","userID","text") VALUES ($1,$2,$3)`
		await db.query(query, [postID, userID, text])

		const getInfosPost = await db.query(
			`SELECT * FROM posts where id =$1`,
			[postID]
		)
		const query3 = `UPDATE posts SET "quantityComments" = $1 + 1 WHERE id=$2`
		const result3 = await db.query(query3, [
			getInfosPost.rows[0].quantityComments,
			postID,
		])
		console.log(getInfosPost.rows[0].quantityComments)
		res.status(200).send(getInfosPost.rows)
	} catch (error) {
		res.status(400).send(error)
		console.log(error)
	}
}

export async function commentGET(req, res) {
	const { postID } = req.params

	try {
		const query = `SELECT users.name, users.id as "userID" , users.picture ,comments.text, posts.id as "postID" 
        FROM comments
        JOIN posts on comments."postID" = posts.id
        JOIN users on comments."userID" = users.id
        WHERE comments."postID" = $1`

		const result = await db.query(query, [postID])

		res.status(200).send(result.rows)
	} catch (error) {
		res.status(400).send(error)
	}
}
