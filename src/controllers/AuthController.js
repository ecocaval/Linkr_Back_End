import connection from '../config/database.connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function signUp(req, res) {
	const { email, password, name, image } = req.body;

	try {
		const hasEmail = await connection.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		if (hasEmail.rowCount !== 0)
			return res.status(409).send('Esse email já está em uso');

		const passwordHashed = bcrypt.hashSync(password, 10);

		await connection.query(
			'INSERT INTO users (name, password, email, picture_url) VALUES ($1, $2, $3, $4)',
			[name, passwordHashed, email, image]
		);

		res.sendStatus(201);
	} catch (err) {
		res.status(500).send(err.message);
	}
}

export async function signIn(req, res) {
	const { email, password } = req.body;

	try {
		const hasUser = await connection.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		const userId = hasUser.rows[0].id

		if (hasUser.rowCount === 0)
			return res.status(401).send('Email ou senha inválidos');

		if (!bcrypt.compareSync(password, hasUser.rows[0].password))
			return res.status(401).send('Email ou senha inválidos');

		const token = jwt.sign(
			{ userId },
			process.env.SECRET_KEY,
			{ expiresIn: 32300 }
		);

		res.send({ token, userId });
	} catch (err) {
		res.status(500).send(err.message);
	}
}
