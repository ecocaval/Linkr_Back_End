import connection from "../config/database.connection.js";

export async function insertPost(id, description, link) {
    if (!id || !description || !link) return
    return await connection.query(`
        INSERT INTO posts (user_id, description, link)
        VALUES ($1, $2, $3) 
        RETURNING id;
    `, [id, description, link]);
}

export async function selectPosts(postsOffset, userId) {
    if (!userId) return
    return await connection.query(`
        SELECT p.*,
        CASE 
            WHEN MAX(CASE WHEN pl.user_id = $1 THEN 1 ELSE 0 END) = 1 THEN true 
            ELSE false 
        END AS "likedByUser"
        FROM posts p
        LEFT JOIN posts_likes pl 
            ON pl.post_id = p.id
        JOIN users_followers uf 
            ON ((uf.follower_id = $1 AND uf.followed_id = p.user_id) OR p.user_id = $1)
        GROUP BY p.id
        ORDER BY p.id DESC
        LIMIT 10
        OFFSET $2;
    `, [userId, postsOffset ? 10 * postsOffset : postsOffset]);
}

export async function selectPostById(postId) {
    if (!postId) return []
    return await connection.query(`
        SELECT * 
        FROM posts 
        WHERE id = $1;
    `, [postId]);
}

export async function selectPostsByUserId(idToGet, userId) {
    if (!userId) return []
    return await connection.query(`
        SELECT p.*,
            CASE WHEN MAX(CASE WHEN pl.user_id = $2 THEN 1 ELSE 0 END) = 1 THEN true ELSE false END AS "likedByUser"
        FROM posts p
        LEFT JOIN posts_likes pl ON pl.post_id = p.id
        WHERE p.user_id = $1
        GROUP BY p.id
        ORDER BY p.id DESC;
    `, [idToGet, userId]);
}

export async function selectPostsByHashtag(hashtag, userId) {
    if (!hashtag) return []
    return await connection.query(`
        SELECT p.*,
            CASE WHEN MAX(CASE WHEN pl.user_id = $2 THEN 1 ELSE 0 END) = 1 THEN true ELSE false END AS "likedByUser"
        FROM posts p
        LEFT JOIN posts_likes pl ON pl.post_id = p.id
        WHERE description LIKE $1
        GROUP BY p.id
        ORDER BY p.id DESC;
    `, [`%#${hashtag}%`, userId]);
}

export async function selectLikesCountByPostId(postId) {
    if (!postId) return []
    const response = await connection.query(`
        SELECT count(pl.*), ARRAY_AGG(JSON_BUILD_OBJECT(
            'user_id', u.id,
            'name', u.name
        )) as "usersThatLiked"
        FROM posts_likes pl
        LEFT JOIN users u
            ON pl.user_id = u.id
        WHERE pl.post_id = $1;
    `, [postId]);
    return response
}

export async function selectPostsLikes(userId, postId) {
    if (!userId, !postId) return
    return await connection.query(`
        SELECT * 
        FROM posts_likes 
        WHERE user_id = $1 AND post_id = $2;
    `, [userId, postId]);
}

export async function addLikeToPost(userId, postId) {
    await connection.query(`
        INSERT INTO posts_likes (user_id, post_id) 
        VALUES ($1, $2);
    `, [userId, postId]);
}

export async function updatePostById(postId, description) {
    if (!postId || !description) return
    return await connection.query(`
        UPDATE posts 
        SET description = $1 
        WHERE id = $2;
    `, [`${description}`, postId]);
}

export async function deletePostById(postId) {
    if (!postId) return
    return await connection.query(`
        DELETE FROM posts 
        WHERE id = $1;
    `, [postId]);
}

export async function removeLikeFromPost(userId, postId) {
    await connection.query(`
        DELETE FROM posts_likes 
        WHERE user_id = $1 AND post_id = $2;
    `, [userId, postId]);
}

export async function getPostComments(postId) {
    return await connection.query(`
        SELECT
            c.id,
            c.description,
            c.user_id,
            c.post_id,
            u.name AS user_name,
            u.picture_url AS user_photo
        FROM comments AS c
        JOIN users AS u
            ON c.user_id = u.id
        WHERE c.post_id = $1;
    `, [postId]);
}


export async function getPostsById(userId) {
    if (!userId) return []
    return await connection.query(`
        SELECT * 
        FROM posts 
        WHERE user_id = $1;
    `, [userId]);
}

export async function getSharePost(postId) {
    if (!postId) return
    return await connection.query(`
        SELECT *
        FROM posts
        WHERE id = $1;
    `, [postId])
}

export async function addNewComment(description, postId, userId) {
    return await connection.query(`
        INSERT INTO comments (description, post_id, user_id)
        VALUES ($1, $2, $3)
    `, [description, postId, userId])
}

export async function userExists(userId) {
    return await connection.query(`
        SELECT * FROM users
        WHERE id = $1
    `, [userId])
}

export async function postExists(postId) {
    return await connection.query(`
        SELECT * FROM posts
        WHERE id = $1
    `, [postId])
}

export async function insertSharePost(sharedUserId, description, link, userId, postId) {
    if (!sharedUserId || !description || !link || !userId || !postId) return
    return await connection.query(`
        INSERT INTO posts (user_id, description, link, is_shared, shared_user_id, shared_post_id)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [sharedUserId, description, link, true, userId, postId])
}