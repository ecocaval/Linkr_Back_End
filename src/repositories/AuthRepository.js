import connection from "../config/database.connection.js";

export async function getUserByEmail(email) {
    if (!email) return
    return await connection.query(`
        SELECT * 
        FROM users 
        WHERE email = $1
    `, [email]);
}

export async function createNewUser(user) {
    if (!user) return
    await connection.query(`
        INSERT INTO users (name, password, email, picture_url) ]
        VALUES ($1, $2, $3, $4)
    `, [user.name, user.passwordHashed, user.email, user.image]);
}