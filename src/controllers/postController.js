import db from '../db.js'
import getUserIdByToken from '../repositories/validSessionRepository.js'
import urlMetadata from 'url-metadata'
export async function newPost(req, res) {
	const { url, description } = req.body
	const { token } = res.locals
	const userID = await getUserIdByToken(req, res, token)
	console.log(token)
	const metadata = await urlMetadata(url)
	const urlDescription = metadata.description
	const urlTitle = metadata.title
	const urlImage = metadata.image
	try {
		const query = `INSERT INTO posts 
        (url, description,"userID","urlDescription","urlTitle","urlImage") 
        VALUES ($1,$2,$3,$4,$5,$6)`
		const post = await db.query(query, [
			url,
			description,
			userID,
			urlDescription,
			urlTitle,
			urlImage,
		])
		const hashtags = verifyHashtags(description)

		if (hashtags) {
			//PEGANDO O POST ID
			const postId = await db.query(
				`SELECT id FROM posts where url =$1`,
				[url]
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
		const query = `SELECT users.name as name, users.id, users.picture ,posts.id as "postID",posts.url,posts.description ,posts."urlDescription",posts."urlTitle", posts."urlImage"
		FROM posts
		JOIN users
		ON posts."userID" = users.id 
		ORDER BY posts.id DESC
		LIMIT 20
		`
		//PRECISA COLOCAR OS LIKES NESSA QUERY
		const timeline = await db.query(query)
		res.status(200).send(timeline.rows)
	} catch (error) {
		res.status(400).send(error)
	}
}

export async function showPostsByUser(req, res) {
	const { userID } = req.params
	try {
		const query = `SELECT users.name, users.picture ,posts.url,posts.description 
		FROM posts
		JOIN users
		ON posts."userID" = users.id WHERE posts."userID" = $1`
		//PRECISA COLOCAR OS LIKES NESSA QUERY
		const timeline = await db.query(query, [userID])
		if (timeline.rowCount === 0)
			return res.status(422).send('User not found')
		res.status(200).send(timeline.rows)
	} catch (error) {}
}

export async function showPostsByHastags(req, res) {
	const { hashtag } = req.params
	const hash = `#${hashtag}`
	try {
		const query = `SELECT users.name as name, users.id, users.picture , posts.url ,posts.description , posts."urlDescription" , posts."urlTitle" , posts."urlImage"
		FROM "hashtagsxposts"
		JOIN posts ON "hashtagsxposts"."postID" = posts.id
		JOIN users ON posts."userID" = users.id
		 WHERE "hashtag"= $1`
		const result = await db.query(query, [hash])

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
// export async function deletePostHash(req, res) {
// 	const { postID } = req.params
// 	try {
// 		const query = `DELETE FROM hashtagsxposts WHERE "postID"=$1`

// 		const result = await db.query(query, [postID])
// 		if (result.rowCount === 0)
// 			return res.status(404).send('Not possible delete this post.')

// 		res.status(200).send(result)
// 	} catch (error) {
// 		console.log(error)
// 		res.status(400).send(error)
// 	}
// }
