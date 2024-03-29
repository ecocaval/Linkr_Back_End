import { getLinkPreview } from "link-preview-js";
import { addLikeToPost, addNewComment, deletePostById, getPostComments, getSharePost, insertPost, insertSharePost, postExists, removeLikeFromPost, selectLikesCountByPostId, selectPostById, selectPosts, selectPostsByHashtag, selectPostsByUserId, selectPostsLikes, updatePostById, userExists } from "../repositories/PostRepository.js";
import { createHashtag, decreaseHashtagMentionsCount, linkPostToHashtag, selectHashtagsByName, selectHashtagsIdFromPost, updateHashtagMentionsByName } from "../repositories/HashtagRepository.js";
import { selectUserById } from "../repositories/UserRepository.js";
import { checkForDuplicity } from "../utils/checkDuplicity.js";

export async function publishPost(req, res) {
    const { userId: id } = req.locals
    const { description, link } = req.body

    try {
        const { rows: [{ id: post_id }] } = await insertPost(id, description, link)
        if (description !== "") {

            const hashtags = description
                .match(/#\w+(-\w+)*/g)
                ?.map((hashtag) => hashtag.trim().slice(1).toLowerCase())

            if (hashtags && hashtags.length > 0) {
                for (const name of hashtags) {
                    const { rowCount: hashtagExists, rows: [hashtag] } = await selectHashtagsByName(name)

                    if (!hashtagExists) {
                        const { rows: [{ id: hashtag_id }] } = await createHashtag(name)
                        await linkPostToHashtag(post_id, hashtag_id)
                    } else {
                        updateHashtagMentionsByName(name)
                        await linkPostToHashtag(post_id, hashtag?.id)
                    }
                }
            }
        }
        res.status(201).send();
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

export async function getPosts(req, res) {
    const data = [];
    const { userId } = req.locals;
    const { hashtag, postsOffset } = req.query;
    const { id } = req.params

    try {
        let posts

        if (hashtag) posts = await selectPostsByHashtag(hashtag, userId)
        else if (id) posts = await selectPostsByUserId(id, userId)
        else posts = await selectPosts(postsOffset, userId)

        for (let i = 0; i < posts.rows.length; i++) {
            const urlInfos = await getLinkPreview(posts.rows[i].link);
            const { rows: [{ count: likesCount, usersThatLiked }], } = await selectLikesCountByPostId(posts.rows[i].id)
            const user = await selectUserById(posts.rows[i].user_id)
            const sharedUser = await selectUserById(posts.rows[i].shared_user_id)

            data.push({
                userName: user.rows[0].name,
                userCanDeletePost: userId === posts.rows[i].user_id,
                userId: posts.rows[i].user_id,
                userImage: user.rows[0].image,
                postId: posts.rows[i].id,
                postDesc: posts.rows[i].description,
                isShared: posts.rows[i].is_shared,
                sharedUser: sharedUser.rowCount === 0 ? null : sharedUser.rows[0].name,
                likesCount: likesCount,
                likedByUser: posts.rows[i].likedByUser,
                usersThatLiked: usersThatLiked ? usersThatLiked : [],
                linkData: {
                    url: urlInfos.url,
                    title: urlInfos.title,
                    description: urlInfos.description,
                    image: urlInfos?.images ? urlInfos?.images[0] : null,
                },
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send(e.message)
    }
    return res.status(200).send(checkForDuplicity(data));
}

export async function getPostById(postId) {
    try {
        const post = await selectPostById(postId)
        return post.rows[0];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function editPost(req, res) {
    const { postId } = req.params
    const { description } = req.body
    if (!description) return res.sendStatus(204)
    try {
        const { rowCount: updatedSucessFully } = await updatePostById(postId, description)
        if (!updatedSucessFully) return res.sendStatus(404);
        return res.sendStatus(200);
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    try {
        const { rows: hashtagIds } = await selectHashtagsIdFromPost(postId);

        hashtagIds.forEach(async ({ hashtagId }) => {
            decreaseHashtagMentionsCount(hashtagId)
        })

        const { rowCount: deletedSucessFully } = await deletePostById(postId)
        if (!deletedSucessFully) return res.sendStatus(404);
        return res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function toggleLike(req, res) {
    let { post_id, user_id } = req.body;
    const { userId } = req.locals;

    try {
        let user = await selectUserById(user_id)
        let post = await selectPostById(post_id)

        if (user.rows.length === 0 || post.rows.length === 0)
            return res.sendStatus(400);

        if (userId != user_id) return res.sendStatus(401);

        let likes_posts = await selectPostsLikes(user_id, post_id)

        if (likes_posts.rows.length > 0) removeLikeFromPost(user_id, post_id)
        else addLikeToPost(user_id, post_id)

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function postLiked(req, res) {
    let { post_id, user_id } = req.body;

    try {
        let likes_posts = await selectPostsLikes(user_id, post_id)

        if (likes_posts.rows.length > 0) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getComments(req, res) {
    let { postId } = req.params

    try {
        let comments = await getPostComments(postId)
        res.status(200).send(comments.rows)
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function addComment(req, res) {
    let { description, post_id, user_id } = req.body

    try {
        // check if user and post exists
        let user = await userExists(user_id)
        let post = await postExists(post_id)
        if (user.rows.length === 0 || post.rows.length === 0) return res.sendStatus(404)

        await addNewComment(description, post_id, user_id)

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function sharePost(req, res) {
    const { userId, postId } = req.body

    try {
        const { rows: [{ user_id: sharedUserId, description, link }] } = await getSharePost(postId)
        await insertSharePost(sharedUserId, description, link, userId, postId)

        res.send({ userId, postId })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}