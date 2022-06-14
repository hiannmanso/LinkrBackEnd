import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';
import usersRepository from "../repositories/usersRepository.js";
import sessionsRepository from "../repositories/sessionsRepository.js";

export async function signIn(req, res) {
    const { email, password } = req.body;
    try {
        const { rows: users } = await usersRepository.getUserByEmail(email);
        const [user] = users;
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await sessionsRepository.createSession(user.id, token);
            res.send(token);
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        console.log("Deu erro no login", err);
        res.sendStatus(500);
    }
}