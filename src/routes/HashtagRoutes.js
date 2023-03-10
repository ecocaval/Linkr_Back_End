import { Router } from 'express'
import { getHashtags } from '../controllers/HashtagsController.js'
import { validateToken } from '../middlewares/ValidateToken.js'

const hashtagRouter = Router()

hashtagRouter.get("/hashtags", validateToken, getHashtags)

export default hashtagRouter