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
  return await db.query(`
  SELECT 
    id, 
    email, 
    picture, 
    username, 
    created_at, 
    (
      SELECT COALESCE(
        json_object_agg(followers.followed_id, followed_users.username),
        '{}'::json
      )
      FROM followers
      LEFT JOIN users AS followed_users ON followed_users.id = followers.followed_id
      WHERE followers.follower_id = $1 AND followers.active = true
    ) AS following
    FROM users 
    WHERE id = $1;`, [userId]);
}

async function searchUsers(searchText) {
  const searchTerm = `%${searchText}%`;
  return await db.query(`SELECT id, picture, username FROM users WHERE username ILIKE $1`, [searchTerm]);
}

async function follow({ followedId, userId}) {
  return await db.query(
    `
  INSERT INTO followers (follower_id, followed_id, active) 
      VALUES ($1, $2, true)
      ON CONFLICT (follower_id, followed_id) DO UPDATE SET
      active = NOT followers.active
      RETURNING active;
    `,
    [userId, followedId]
  );
}

const userRepository = { createUser, findUserByEmail, createSession, findUserByToken, signOutUser, findUserById, searchUsers, follow };

export default userRepository;
