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
        SELECT DISTINCT p.* ,
        CASE 
            WHEN pl.user_id = $1 THEN true
            ELSE false
        END AS "likedByUser"
        FROM posts p
        LEFT JOIN posts_likes pl
            ON pl.post_id = p.id
        JOIN users_followers uf
            ON ((uf.follower_id = $1 AND uf.followed_id = p.user_id) OR p.user_id = $1)
        ORDER BY id DESC 
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

export async function selectPostsByUserId(userId) {
    if (!userId) return []
    return await connection.query(`
        SELECT * 
        FROM posts 
        WHERE user_id = $1 
        ORDER BY id DESC 
        LIMIT 20;
    `, [userId]);
}

export async function selectPostsByHashtag(hashtag) {
    if (!hashtag) return []
    return await connection.query(`
        SELECT * 
        FROM posts 
        WHERE description 
        LIKE $1 
        ORDER BY id DESC 
        LIMIT 20;
    `, [`%#${hashtag}%`]);
}

export async function selectLikesCountByPostId(postId) {
    if (!postId) return []
    return await connection.query(`
        SELECT count(*) 
        FROM posts_likes 
        WHERE post_id = $1;
    `, [postId]);
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
        SELECT * FROM comments
        WHERE post_id = $1
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

export async function insertSharePost(sharedUserId, description, link, userId, postId) {
    if (!sharedUserId || !description || !link || !userId || !postId) return
    return await connection.query(`
        INSERT INTO posts (user_id, description, link, is_shared, shared_user_id, shared_post_id)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [sharedUserId, description, link, true, userId, postId])
}