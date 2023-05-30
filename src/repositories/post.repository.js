import db from "../configs/database.connection.js";

async function createPost({ url, content, userId }) {
    return await db.query(`INSERT INTO posts (url, content, user_id) VALUES ($1, $2, $3);`, [url, content, userId]);
}

async function getPosts() {
    return await db.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT 20;`);
}

const postRepository = { createPost, getPosts };
export default postRepository;