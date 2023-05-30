import db from "../configs/database.connection.js";

async function createUser({ email, password, username, picture }) {
  return await db.query(
    `
    INSERT INTO
        users (
            email,
            password,
            username,
            picture
        )
    VALUES ($1, $2, $3, $4);
    `,
    [email, password, username, picture]
  );
}

async function findUserByEmail({ email }) {
  return await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
}

async function createSession({ userId, token }) {
  return await db.query(`INSERT INTO sessions (user_id, token) VALUES ($1, $2);`, [userId, token]);
}

async function findUserByToken({ token }) {
  return await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
}

async function signOutUser({ userId, token }) {
  return await db.query(`UPDATE sessions SET active = false WHERE user_id = $1 AND token = $2;`, [userId, token]);
}

async function findUserById(userId) {
  return await db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
}

const userRepository = { createUser, findUserByEmail, createSession, findUserByToken, signOutUser, findUserById };
export default userRepository;
