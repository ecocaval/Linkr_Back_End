import connection from "../config/database.connection.js"

export async function getHashtags(req, res) {
    try {
        const hashtags = await connection.query(`
                SELECT h.name, h.mentions_count as "mentionsCount"
                FROM hashtags h
                WHERE h.mentions_count > 0
                ORDER BY h.mentions_count DESC
                LIMIT 10;
            `
        )
        res.status(200).send(hashtags.rows)
    } catch (error) {
        res.status(500).send(error)
    }
}