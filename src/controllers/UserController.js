import connection from "../config/database.connection.js"

export async function getUsers(req, res) {
    const { userId } = req.locals
    try {
        const users = await connection.query(`
            SELECT u.id, u.name, u.picture_url as image
            FROM users u
            WHERE u.id <> $1;
            `, [userId]
        )
        res.status(200).send(users.rows)
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getMyUser(req, res) {
    const { userId } = req.locals
    try {
        const user = await connection.query(`
            SELECT u.id, u.name, u.picture_url as image
            FROM users u 
            WHERE id = $1;
            `, [userId]
        )
        res.status(200).send(user.rows[0])
    } catch (error) {
        res.status(500).send(error)
    }
}