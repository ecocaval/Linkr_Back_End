import connection from "../config/database.connection.js"

export async function selectUsers(userId) {
    return await connection.query(`
        SELECT u.id, u.name, u.picture_url as image,
        CASE 
            WHEN COUNT(uf.follower_id) > 0 THEN true
            ELSE false
        END AS "imFollowing"
        FROM users u
        LEFT JOIN users_followers uf
            ON uf.followed_id = u.id AND uf.follower_id = $1 
        WHERE u.id <> $1
        GROUP BY u.id;
    `, [userId])
}

export async function selectUserById(userId) {
    return await connection.query(`
        SELECT u.id, u.name, u.picture_url as image, COUNT(uf.follower_id) as "numberOfFollows"
        FROM users u 
        LEFT JOIN users_followers uf
            ON uf.follower_id = u.id
        WHERE u.id = $1
        GROUP BY u.id;
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
    `, [myId, userId])
}

export async function userFollowing(userId) {
    return await connection.query(`
        SELECT follower_id, followed_id 
        FROM users_followers 
        WHERE follower_id= $1;
    `, [userId])
}