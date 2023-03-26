import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createNewUser, getUserByEmail } from '../repositories/AuthRepository.js';

export async function signUp(req, res) {
	const { email, password, name, image } = req.body;
	try {
		const { rowCount: hasEmail } = await getUserByEmail(email)

		if (hasEmail) {
			return res.status(409).send('Esse email já está em uso');
		}

		createNewUser({
			name,
			passwordHashed: bcrypt.hashSync(password, 10),
			email,
			image
		})
		res.sendStatus(201);
	} catch (err) {
		console.log(err)
		res.status(500).send(err.message);
	}
}

export async function signIn(req, res) {
	const { email, password } = req.body;

	try {
		const user = await getUserByEmail(email)

		const userId = user.rows[0]?.id

		if (user.rowCount === 0)
			return res.status(401).send('Email ou senha inválidos');

		if (!bcrypt.compareSync(password, user.rows[0].password))
			return res.status(401).send('Email ou senha inválidos');

		const token = jwt.sign(
			{ userId },
			process.env.SECRET_KEY,
			{ expiresIn: 32300 }
		)
		res.send({ token, userId });
	} catch (err) {
		console.log(err)
		res.status(500).send(err.message);
	}
}
