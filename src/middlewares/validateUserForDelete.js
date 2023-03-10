import { getPostById } from "../controllers/PostController.js"

export default async function validateUserForDelete(req, res, next) {
    const { postId } = req.params
    const { userId } = req.locals
    try {
        const post = await getPostById(postId)
        if (userId !== post?.user_id) return res.sendStatus(401)
    } catch (error) {
        console.log(error)
    }
    next()
}