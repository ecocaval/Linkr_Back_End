import connection from "../config/database.connection.js";

export async function selectHashtags() {
    return await connection.query(`
        SELECT h.name, h.mentions_count as "mentionsCount"
        FROM hashtags h
        WHERE h.mentions_count > 0
        ORDER BY h.mentions_count DESC
        LIMIT 10;
    `);
}

export async function selectHashtagsIdFromPost(postId) {
    if (!postId) return []
    return await connection.query(`
        SELECT hashtag_id as "hashtagId" 
        FROM posts_hashtags 
        WHERE post_id = $1
    `, [postId]);
}

export async function selectHashtagsByName(name) {
    if (!name) return []
    return await connection.query(`
        SELECT * FROM hashtags WHERE name = $1
    `, [name]);
}

export async function createHashtag(name) {
    if (!name) return
    return await connection.query(`
        INSERT INTO hashtags (name, mentions_count) 
        VALUES ($1, $2) 
        RETURNING id
    `, [name, 1]);
}

export async function linkPostToHashtag(post_id, hashtag_id) {
    if (!post_id || !hashtag_id) return
    await connection.query(`
        INSERT INTO posts_hashtags (post_id, hashtag_id) 
        VALUES ($1, $2)
    `, [post_id, hashtag_id]);
}

export async function updateHashtagMentionsByName(name) {
    if (!name) return
    await connection.query(`
        UPDATE hashtags 
        SET mentions_count = mentions_count + 1 
        WHERE name = $1
    `, [name]);
}

export async function decreaseHashtagMentionsCount(hashtagId) {
    if (!hashtagId) return
    await connection.query(`
        UPDATE hashtags 
        SET mentions_count = mentions_count - 1 
        WHERE id = $1
    `, [hashtagId]);
}

