import db from "../configs/database.connection";

async function createPost({ url, content, userId }) {
    return await db.query(`INSERT INTO posts (url, content, user_id) VALUES ($1, $2, $3);`, [url, content, userId]);
}

const postRepository = { createPost };
export default postRepository;