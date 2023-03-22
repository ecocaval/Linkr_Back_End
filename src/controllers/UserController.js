import { selectUserById, selectUsers } from "../repositories/UserRepository.js"

export async function getUsers(req, res) {
    const { userId } = req.locals
    try {
        const users = await selectUsers(userId)
        res.status(200).send(users.rows)
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