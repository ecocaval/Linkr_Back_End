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

export async function insertFollowUser(myId, userId) {
    return await connection.query(`
        INSERT INTO users_followers (follower_id, followed_id)
        VALUES ($1, $2)
    `, [myId, userId])
}

export async function deleteFollowUser(myId, userId) {
    return await connection.query(`
        DELETE FROM users_followers WHERE follower_id = $1 AND followed_id = $2
    `, [myId, userId])
}

export async function selectFollow(myId, userId) {
    return await connection.query(`
        SELECT * FROM users_followers WHERE follower_id = $1 AND followed_id = $2
    `, [ myId ,userId])
}