import db from "../db.js";

async function createSession(userId, token) {
    return db.query(`INSERT INTO sessions ("userID", token) VALUES ($1,$2)`, [userId, token]);
}

const sessionsRepository = {
    createSession
};

export default sessionsRepository;