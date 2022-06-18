import db from '../db.js'
import likesRepository from '../repositories/likeRepository.js'
import getUserIdByToken from '../repositories/validSessionRepository.js'

export async function newPost(req, res) {
	const { url, description } = req.body
	const { token } = res.locals
	const userID = await getUserIdByToken(req, res, token)
	try {
		const query = `INSERT INTO posts 
        (url, description,"userID") 
        VALUES ($1,$2,$3)`
		const post = await db.query(query, [url, description, userID])
		const hashtags = verifyHashtags(description)

		const postId = await db.query(
			`SELECT id FROM posts where url =$1`,
			[url]
		)

		await likesRepository.likePost(userID, postId.rows[0].id);

		if (hashtags) {
			//PEGANDO O POST ID


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
		const query = `SELECT users.name as name,posts.url,posts.description 
		FROM posts
		JOIN users
		ON posts."userID" = users.id`
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
		const query = `SELECT users.name as name, users.picture, posts.url, posts.description, likes.quantity
		FROM likes
		JOIN posts
		ON posts.id = likes."postID"
		JOIN users
		ON users.id = posts."userID"
		WHERE posts."userID" = $1`;
		//PRECISA COLOCAR OS LIKES NESSA QUERY
		const timeline = await db.query(query, [userID])
		if (timeline.rowCount === 0)
			return res.status(422).send('User not found')
		res.status(200).send(timeline.rows)
	} catch (error) { }
}

export async function showPostsByHastags(params) { }

function verifyHashtags(post) {
	let index = post.indexOf('#')
	if (index === -1) return
	let newstr = post.slice(index)
	let arr = newstr.split(' ')
	return arr
}
