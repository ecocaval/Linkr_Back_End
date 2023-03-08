import connection from "../config/database.connection.js";

export async function publishPost(req, res) {
    // const {id} = res.locals.user;
    const id = 1
    const {description, link} = req.body

    try {
        await connection.query(`
        INSERT INTO posts (user_id, description, link)
        VALUES ($1, $2, $3)
        `, [id, description, link])

        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }
}
