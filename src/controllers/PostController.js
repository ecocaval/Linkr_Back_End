import connection from "../config/database.connection.js";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

export async function publishPost(req, res) {
    const { userId: id } = req.locals;
    const { description, link } = req.body;

    let descriptionCopy = description;

    if (!descriptionCopy) {
        descriptionCopy = null;
    }

    try {
        const {
            rows: [{ id: post_id }],
        } = await connection.query(
            `
        INSERT INTO posts (user_id, description, link)
        VALUES ($1, $2, $3) RETURNING id
        `,
            [id, description, link]
        );

        if (description !== "") {
            const hashtags = description
                .match(/#\w+(-\w+)*/g)
                ?.map((hashtag) => hashtag.trim().slice(1).toLowerCase());
            if (hashtags && hashtags.length > 0) {
                for (const name of hashtags) {
                    const { rowCount } = await connection.query(
                        `
                    SELECT * FROM hashtags WHERE name = $1
                    `,
                        [name]
                    );

                    if (rowCount < 1) {
                        const {
                            rows: [{ id: hashtag_id }],
                        } = await connection.query(
                            `
                        INSERT INTO hashtags (name, mentions_count) VALUES ($1, $2) RETURNING id
                    `,
                            [name, 1]
                        );

                        await connection.query(
                            `
                    INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ($1, $2)
                    `,
                            [post_id, hashtag_id]
                        );
                    }

                    if (rowCount > 0) {
                        await connection.query(
                            `
                        UPDATE hashtags SET mentions_count = mentions_count + 1 WHERE name = $1
                        `,
                            [name]
                        );
                    }
                }
            }
        }

        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getPosts(req, res) {
    const data = [];
    const { userId } = req.locals;
    const { hashtag } = req.query;
    const { getMyUser } = req.query;

    try {
        let posts

        if (getMyUser) {
            posts = await connection.query("SELECT * FROM posts WHERE user_id = $1 ORDER BY id DESC;", [userId]);
        } else if (hashtag) {
            posts = await connection.query("SELECT * FROM posts WHERE description LIKE $1 ORDER BY id DESC;", [`%#${hashtag}%`]);
        } else {
            posts = await connection.query("SELECT * FROM posts ORDER BY id DESC;");
        }

        for (let i = 0; i < posts.rows.length; i++) {
            const urlInfos = await getLinkPreview(posts.rows[i].link);

            const likesCount = await connection.query(
                "SELECT count(*) FROM posts_likes WHERE post_id = $1;",
                [posts.rows[i].id]
            );

            const user = await connection.query(
                "SELECT * FROM users WHERE id = $1;",
                [posts.rows[i].user_id]
            );

            data.push({
                userName: user.rows[0].name,
                userCanDeletePost: userId === posts.rows[i].user_id,
                userId: posts.rows[i].user_id,
                userImage: user.rows[0].picture_url,
                postId: posts.rows[i].id,
                postDesc: posts.rows[i].description,
                likesCount: likesCount.rows[0].count,
                linkData: {
                    url: urlInfos.url,
                    title: urlInfos.title,
                    description: urlInfos.description,
                    image: urlInfos.images[0],
                },
            });
        }
    } catch (e) {
        console.error(e);
    }
    return res.status(200).send(data);
}

export async function getPostById(postId) {
    try {
        const post = await connection.query("SELECT * FROM posts WHERE id = $1;", [
            postId,
        ]);
        return post.rows[0];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function editPost(req, res) {
    const { postId } = req.params;
    const { description } = req.body
    if (!description) return res.sendStatus(204)
    try {
        const response = await connection.query(`UPDATE posts SET description = $1 WHERE id = $2;`, [`${description}`, postId]);
        if (response.rowCount === 0) return res.sendStatus(404);
        return res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    try {
        const response = await connection.query(`DELETE FROM posts WHERE id = $1`, [
            postId,
        ]);
        if (response.rowCount === 0) return res.sendStatus(404);
        return res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function toggleLike(req, res) {
    let { post_id, user_id } = req.body;
    const { userId } = req.locals;

    try {
        let user = await connection.query("SELECT * FROM users WHERE id = $1;", [
            user_id,
        ]);
        let post = await connection.query("SELECT * FROM posts WHERE id = $1;", [
            post_id,
        ]);

        if (user.rows.length === 0 || post.rows.length === 0)
            return res.sendStatus(400);

        if (userId != user_id) return res.sendStatus(401);

        let likes_posts = await connection.query(
            "SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2;",
            [user_id, post_id]
        );

        if (likes_posts.rows.length > 0) {
            // remove like
            await connection.query(
                "DELETE FROM posts_likes WHERE user_id = $1 AND post_id = $2;",
                [user_id, post_id]
            );
        } else {
            // add like
            await connection.query(
                "INSERT INTO posts_likes (user_id, post_id) VALUES ($1, $2);",
                [user_id, post_id]
            );
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postLiked(req, res) {
    let { post_id, user_id } = req.body;
  
    try {
      let likes_posts = await connection.query(
        "SELECT * FROM posts_likes WHERE user_id = $1 AND post_id = $2;",
        [user_id, post_id]
      );
  
      if (likes_posts.rows.length > 0) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
