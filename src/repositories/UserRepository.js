import connection from "../config/database.connection.js"

export async function selectUsers(userId) {
    return await connection.query(`
        SELECT u.id, u.name, u.picture_url as image
        FROM users u
        WHERE u.id <> $1;
    `, [userId])
}

export async function selectUserById(userId) {
    return await connection.query(`
        SELECT u.id, u.name, u.picture_url as image
        FROM users u 
        WHERE id = $1;
    `, [userId])
}