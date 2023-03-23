import { deleteFollowUser, insertFollowUser, selectFollow, selectUserById, selectUsers } from "../repositories/UserRepository.js"

export async function getUsers(req, res) {
    const { userId } = req.locals
    const { id } = req.query
    try {
        if (id) {
            const { rows: [user] } = await selectUserById(id)
            return res.status(200).send(user)
        }
        const { rows: users } = await selectUsers(userId)
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getMyUser(req, res) {
    const { userId } = req.locals
    try {
        const user = await selectUserById(userId)
        res.status(200).send(user.rows[0])
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function followUser(req, res) {
    const {follower_id, followed_id } = req.body;
    try {
        const {rowCount} = await selectFollow(follower_id, followed_id)
        if(rowCount > 0 || followed_id === follower_id) return res.sendStatus(409)
        
        await insertFollowUser(follower_id, followed_id)
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function deleteFollow(req, res) {
    const {follower_id, followed_id } = req.body;
    try {
        const {rowCount} = await selectFollow(follower_id, followed_id)
        if(rowCount === 0) return res.sendStatus(409)

        await deleteFollowUser(follower_id, followed_id)
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(error)
    }
}