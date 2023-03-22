import { selectHashtags } from "../repositories/HashtagRepository.js"

export async function getHashtags(req, res) {
    try {
        const { rows: hashtags } = await selectHashtags()
        res.status(200).send(hashtags)
    } catch (error) {
        res.status(500).send(error)
    }
}