import jwt from "jsonwebtoken";

export async function validateToken(req, res, next) {

    const { authorization } = req.headers

    if (!authorization) return res.sendStatus(401)

    const token = authorization.replace("Bearer ", "")

    try {
        const { userId } = jwt.verify(token, process.env.SECRET_KEY);
        req.locals = { userId }

    } catch (err) {
        return res.sendStatus(401)
    }
    next()
}