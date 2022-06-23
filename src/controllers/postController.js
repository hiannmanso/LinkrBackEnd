import db from '../db.js'
import getUserIdByToken from '../repositories/validSessionRepository.js'
import urlMetadata from 'url-metadata'
import postRepository from '../repositories/postRepository.js'

export async function newPost(req, res) {
	const { url, description } = req.body
	const { token } = res.locals
	const userID = await getUserIdByToken(req, res, token)
	const metadata = await urlMetadata(url)
	const urlDescription = metadata.description
	const urlTitle = metadata.title
	const urlImage = metadata.image
	const date = new Date()
	try {
		const query = `INSERT INTO posts 
        (url, description,"userID","urlDescription","urlTitle","urlImage","date") 
        VALUES ($1,$2,$3,$4,$5,$6,$7)`
		const post = await db.query(query, [
			url,
			description,
			userID,
			urlDescription,
			urlTitle,
			urlImage,
			date,
		])
		const hashtags = verifyHashtags(description)

		if (hashtags) {
			//PEGANDO O POST ID
			const postId = await db.query(
				`SELECT id FROM posts where url =$1 AND description=$2 AND date =$3 `,
				[url, description, date]
			)

			for (const item of hashtags) {
				if (item[0] === '#') {
					//VERIFICA SE JA TEM ESSA HASHTAG NA TABLE
					const verifyDatabase = await db.query(
						`SELECT * FROM hashtags WHERE name =$1`,
						[item]
					)
					if (verifyDatabase.rowCount === 0) {
						//ADICIONA AO HASHTAGS
						await db.query(
							`INSERT INTO hashtags (name) VALUES($1) `,
							[item]
						)
					}
					//ADICIONA AO HASHTAGXPOST
					await db.query(
						`INSERT INTO hashtagsxposts ("postID",hashtag) VALUES ($1,$2)`,
						[postId.rows[0].id, item]
					)
				}
			}
		}
		res.sendStatus(201)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}

export async function showAllPosts(req, res) {
	try {
		const query = `SELECT users.name as name, users.id, users.picture ,posts.id as "postID",posts.url,posts.description ,posts."urlDescription",posts."urlTitle", posts."urlImage", posts."quantityLikes", posts."quantityComments",posts.reposts, posts.date, posts.reposts, posts."repUserID", posts."repUserNAME"
		FROM posts
		JOIN users ON posts."userID" = users.id 
		UNION ALL 
		SELECT u2.name as name, u2.id, u2.picture ,p1.id as "postID",p1.url,p1.description ,p1."urlDescription",p1."urlTitle", p1."urlImage", p1."quantityLikes", p1."quantityComments",p1.reposts, p1.date, p1.reposts, u1.id, u1.name
		FROM reposts
		JOIN posts p1 ON reposts."postID" = p1.id
		JOIN users u1 ON reposts."repostUserID" = u1.id
		JOIN users u2 ON p1."userID" = u2.id
		ORDER BY date DESC
		`
		//PRECISA COLOCAR OS LIKES NESSA QUERY
		const timeline = await db.query(query)
		res.status(200).send(timeline.rows)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}

export async function showPostsByUser(req, res) {
	const { userID } = req.params
	try {
		const query = `SELECT users.name as name, users.id, users.picture ,posts.id as "postID",posts.url,posts.description ,posts."urlDescription",posts."urlTitle", posts."urlImage", posts."quantityLikes",posts."quantityComments",posts.reposts
		FROM posts
		JOIN users ON posts."userID" = users.id 
		WHERE posts."userID" = $1`
		//PRECISA COLOCAR OS LIKES NESSA QUERY
		const timeline = await db.query(query, [userID])
		if (timeline.rowCount === 0)
			return res.status(422).send('User not found')
		res.status(200).send(timeline.rows)
	} catch (error) {}
}

export async function showPostsByHastags(req, res) {
	const { hashtag } = req.params
	const hash = `'#${hashtag}'`
	try {
		const query = `SELECT users.name as name, users.id, users.picture ,posts.id as "postID",posts.url, posts.description ,posts."urlDescription",posts."urlTitle", posts."urlImage", posts."quantityLikes"
		FROM "hashtagsxposts"
		JOIN posts ON "hashtagsxposts"."postID" = posts.id
		JOIN users ON posts."userID" = users.id
		WHERE hashtag = ${hash}
	
		`
		const result = await db.query(query)

		res.status(200).send(result.rows)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}

function verifyHashtags(post) {
	let index = post.indexOf('#')
	if (index === -1) return
	let newstr = post.slice(index)
	let arr = newstr.split(' ')
	return arr
}

export async function toEditPost(req, res) {
	const id = parseInt(req.params.id)
	const { description } = req.body
	const { token } = res.locals
	const userID = await getUserIdByToken(req, res, token)

	if (!id) {
		return res.sendStatus(404)
	}
	try {
		const { rows } = await postRepository.getPublicationOwner(id)
		if (rows[0].userID !== userID) {
			return res.sendStatus(401)
		}
		await postRepository.editPost(id, description)
		res.sendStatus(200)
	} catch (err) {
		console.log('Deu erro na edição do post', err)
		res.sendStatus(500)
	}
}

export async function getRankingHash(req, res) {
	try {
		const query = `SELECT COUNT(hashtagsxposts.hashtag) as count, hashtagsxposts.hashtag
		FROM hashtagsxposts
		GROUP BY hashtagsxposts.hashtag, hashtagsxposts.hashtag
		ORDER BY count DESC
		LIMIT 10
		`
		const result = await db.query(query)

		res.status(200).send(result.rows)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}

export async function deletePost(req, res) {
	const { postID } = req.params
	try {
		const query = `DELETE FROM posts WHERE id=$1`

		const result = await db.query(query, [postID])
		if (result.rowCount === 0)
			return res.status(404).send('Not possible delete this post.')

		res.status(200).send(result)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}
export async function deletePostHash(req, res) {
	const { postID } = req.params
	try {
		const query = `DELETE FROM hashtagsxposts WHERE "postID"=$1`

		const result = await db.query(query, [postID])
		if (result.rowCount === 0)
			return res.status(404).send('Not possible delete this post.')

		res.status(200).send(result)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}

export async function getPost(req, res) {
	const { id } = req.params
	try {
		const { rows } = await postRepository.getPostById(id)
		const [row] = rows
		console.log(row, 'aqui')
		res.send(row)
	} catch (err) {
		console.log('Error in getPost', err)
		res.sendStatus(500)
	}
}

export async function repostPOST(req, res) {
	const { postID, repostUserID } = req.body
	try {
		const query = `INSERT INTO reposts ("postID","repostUserID") VALUES ($1,$2)`
		const result = await db.query(query, [postID, repostUserID])

		const getInfosPost = await db.query(
			`SELECT * FROM posts where id =$1`,
			[postID]
		)
		const query3 = `UPDATE posts SET "reposts" = $1 + 1 WHERE id=$2`
		const result3 = await db.query(query3, [
			getInfosPost.rows[0].reposts,
			postID,
		])

		res.sendStatus(200)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}
export async function repostGET(req, res) {
	try {
		const query = `SELECT u1.name as "repostUsername", u1.id as "repostuserID", u2.name as name, u2.id, u2.picture ,posts.id as "postID",posts.url, posts.description ,posts."urlDescription",posts."urlTitle", posts."urlImage", posts."quantityLikes", posts.reposts, posts.date
		FROM reposts
		JOIN posts ON reposts."postID" = posts.id
		JOIN users u1 ON reposts."repostUserID" = u1.id
		JOIN users u2 ON posts."userID" = u2.id
		`
		const result = await db.query(query)

		res.status(200).send(result.rows)
	} catch (error) {
		console.log(error)
		res.status(400).send(error)
	}
}
