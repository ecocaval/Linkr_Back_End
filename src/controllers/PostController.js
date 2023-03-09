import connection from "../config/database.connection.js"
import { getLinkPreview, getPreviewFromContent } from "link-preview-js"

export async function publishPost(req, res) {
    const {userId: id} = req.locals;
    const {description, link} = req.body

    let descriptionCopy = description

    if(!descriptionCopy){
        descriptionCopy = null
    }

    try {
        if(description !== ""){
            const hashtags = description.match(/#\w+\s*/g)?.map(hashtag => hashtag.trim().slice(1).toLowerCase());
    
            if (hashtags && hashtags.length > 0) {
                for (const name of hashtags) {
                    const {rowCount} = await connection.query(`
                    SELECT * FROM hashtags WHERE name = $1
                    `, [name])
    
                    if(rowCount < 1){
                        await connection.query(`
                        INSERT INTO hashtags (name, mentions_count) VALUES ($1, $2)
                    `, [name, 1])
                    }
    
                    if(rowCount > 0){
                        await connection.query(`
                        UPDATE hashtags SET mentions_count = mentions_count + 1 WHERE name = $1
                        `, [name])   
                    }
                }
              }
        }
    
        await connection.query(`
        INSERT INTO posts (user_id, description, link)
        VALUES ($1, $2, $3)
        `, [id, description, link])

        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getPosts (req, res) {
    try {
        let posts = await connection.query('SELECT * FROM posts;')
        let data = []

        for (let i = 0; i < posts.rows.length; i++) {
            let urlInfos = await getLinkPreview(posts.rows[i].link)
            let likesCount = await connection.query('SELECT count(*) FROM posts_likes where post_id = $1;', [posts.rows[i].id])

            let user = await connection.query('SELECT * FROM users WHERE id = $1;', [posts.rows[i].user_id])

            data.push({
                userName: user.rows[0].name,
                userImage: user.rows[0].picture_url,
                postDesc: posts.rows[i].description,
                likesCount: likesCount.rows[0].count,
                linkData: {
                    url: urlInfos.url,
                    title: urlInfos.title,
                    description: urlInfos.description,
                    image: urlInfos.images[0]
                }
            })
        }

        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error)
    }
}
