import { selectUserById, selectUsers } from "../repositories/UserRepository.js"

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